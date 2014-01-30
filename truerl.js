(function() {
  // Match things beginning with https://, http://, ftp://, file://, or things
  // that look like a domain name and possibly a path.
  var urlPattern = /^(?:https?|ftp|file):\/\/\S+$|^[a-zA-Z0-9.-]+\.[a-z]{2,4}\/\S*$/;
  var schemePattern = /^[a-zA-Z0-9+.-]+(?=:\/\/)/;

  var enforceUrl = function(element, url) {
    if(!schemePattern.test(url)) {
      url = "http://" + url;
    }
	var oldUrl = element.getAttribute("href");
	if(url != oldUrl) {
	  element.setAttribute("href", url);
	  if(urlPattern.test(element.getAttribute("title"))) {
		element.setAttribute("title", url);
	  }
	}
  }
  
  var trueUrl = function(element, oldUrl) {
	var title = element.getAttribute("title");
	var innerText = element.innerText;
	
	if(urlPattern.test(innerText)) {
	  return enforceUrl(element, innerText);
	}
	
	if(urlPattern.test(title)) {
	  return enforceUrl(element, title);
	}
	
	if(urlPattern.test(oldUrl)) {
	  var newUrl = element.getAttribute("href");
	  if(newUrl.indexOf(oldUrl) >= 0 ||
	     newUrl.indexOf(encodeURIComponent(oldUrl)) >= 0) {
		return enforceUrl(element, oldUrl);
	  }
	}
  }

  // Replace the hrefs for any link that has a url-like content
  var allLinks = document.getElementsByTagName("a");
  for(var i = 0; i < allLinks.length; ++i) {
    trueUrl(allLinks[i]);
  }
  
  var attributeObserver = new MutationObserver(function(mutations) {
	for(var i = 0; i < mutations.length; ++i) {
	  trueUrl(mutations[i].target, mutations[i].oldValue);
	}
  });
  attributeObserver.observe(document.getElementsByTagName("html")[0], {
	subtree: true,
	attributes: true,
	attributeOldValue: true,
	attributeFilter: ["href"]
  });
  
  var nodeObserver = new MutationObserver(function(mutations) {
	for(var i = 0; i < mutations.length; ++i) {
	  var childLinks = mutations[i].target.getElementsByTagName("a");
	  for(var j = 0; j < childLinks.length; ++j) {
	    trueUrl(childLinks[j]);
	  }
	}
  });
  nodeObserver.observe(document.getElementsByTagName("html")[0], {
	subtree: true,
	childList: true,
  });
  
})();
