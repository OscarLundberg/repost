if (window.location.hash.length <= 0) {
  window.location.assign("#actions-anchor");
}


function edit(obj, name, action = "update", method = "post") {
  const formId = `form-${name}`;
  document.querySelector(`#dialog-${formId}`).showModal();
  document.querySelector(`#${formId}`).setAttribute("action", document.querySelector(`#${formId}`).getAttribute("action").replace(/\/(create|update)\?/, `/${action}?callbackUrl=${encodeURIComponent("/" + window.location.hash)}&`));
  document.querySelector(`#${formId}`).method = method;
  for (let [key, val] of Object.entries(obj)) {
    console.log({ key, val });
    document.querySelector(`#${formId} *[name=${key}]`).value = val;
  }
  let html = (obj.id) ? `Editing <em>'${obj.label ?? obj.url ?? obj.id}'</em>` : `${name.slice(0, 1).toUpperCase() + name.slice(1)} – Creating new...`;
  document.querySelector(`#dialog-${formId} b`).innerHTML = html;
}


function add(name) {
  const defaults = entityDefaults[name];
  edit(defaults, name, "create", "post");
}

function clone(obj, name) {
  const {id, ...rest} = obj;
  edit(rest, name, "create")
}

async function deleteEntity(name, id) {
  if (window.confirm(`Confirm deletion of entity \`${id}\` from table \`${name}\`\n\nThis operation cannot be undone.`)) {
    const res = await fetch(`/api/${name}/delete/${id}`, {
      method: "DELETE"
    });
    console.log(`/api/${name}/delete`);
    if (res.ok) {
      location.reload();
    }
  }
}