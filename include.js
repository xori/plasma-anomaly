$(function() {
  doGoogleFetch();
})

function strip(dom, raw) {
  if(raw) return dom;
  try {
    return /<body[^>]*>(.*)<\/body>/g.exec(dom)[1];
  } catch(err) {
    return dom
  }
}

function insert(target, payload) {
  if(target[0] && target[0].createShadowRoot) {
    var T = target[0].createShadowRoot();
    T.innerHTML = (payload);
    window.T = T;
  } else {
    target.html(payload);
  }
}

function doGoogleFetch() {
  // find all sections with data-fragments
  $sections = $("section[data-fragment]");
  $sections.each(function() {
    // check if in localstorage.
    var id = $(this).data("fragment");
    var $section = $(this);
    var raw = $section.data("raw") || false;
    var doCache = $section.data("cache") || true;
    if(sessionStorage.getItem(id)!=null) {
      console.log("[",id,"] Using Cache")
      var cache = JSON.parse(sessionStorage.getItem(id));
      if(new Date(cache.expiry) < new Date()) {
        sessionStorage.removeItem(id);
        console.log("[",id,"] Cache Expiried")
        //continue with fetch.
      } else {
        insert($section, strip(cache.content, raw));
        return; // we're done here.
      }
    }
    // request content
    $.get("http://localhost:8000/"+id, {}, function(data) {
      //insert data
      d = data;
      insert($section, strip(data, raw));
      //store in localstorage
      var expiry = new Date();
      expiry = new Date(expiry.setHours(expiry.getHours() + 5));
      if(doCache) {
        sessionStorage.setItem(id, JSON.stringify({
          content: data,
          expiry: expiry
        }))
      }
    })
  });
}
