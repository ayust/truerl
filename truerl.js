(function() {
  // Match things beginning with https://, http://, ftp://, file://, or things
  // that look like a domain name and possibly a path.
  var urlPattern = /^(?:https?|ftp|file):\/\/\S+$|^[a-zA-Z0-9.-]+\.[a-z]{2,4}(?:\/\S*)?$/;
  var schemePattern = /^[a-zA-Z0-9+.-]+(?=:\/\/)/;

  var makeUrl = function(text) {
    if(schemePattern.test(text)) {
      return text;
    }
    return "http://" + text;
  }

  // Replace the hrefs for any link that has a url-like content
  var allLinks = document.getElementsByTagName("a");
  for(var i = 0; i < allLinks.length; ++i) {
    var elem = allLinks[i];
    var title = elem.getAttribute("title");
    var innerText = elem.innerText;
    if(urlPattern.test(innerText)) {
      elem.setAttribute("href", makeUrl(innerText));
      // Also update the title to match, if it was a url
      if(urlPattern.test(title)) {
        elem.setAttribute("title", innerText);
      }
    } else if(urlPattern.test(title)) {
      elem.setAttribute("href", makeUrl(title));
    }
  }
})();
