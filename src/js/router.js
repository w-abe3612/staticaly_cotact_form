(function () {
  history.replaceState( null,null,window.location.pathname + "#" + "contact" )
}());
export function router( pageState ) {
  pageState = pageState.length?pageState:"contact";
  history.replaceState( null,null,window.location.pathname + "#" + pageState )
}
