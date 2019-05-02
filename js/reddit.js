'use strict';

function process_reddit(kind, data) {
  if (!data.children.length || kind != 'Listing') {
    return;
  }

  let $d = document;
  
  let frag = $d.createDocumentFragment();

  let $h2 = $d.createElement('h2');
  $h2.appendChild($d.createTextNode('This Post on Reddit'));

  frag.appendChild($h2);

  let $ul = $d.createElement('ul');
  frag.appendChild($ul);

  for(child of data.children) {
    let {$link: permalink, $name: subreddit_name_prefixed, $comments: num_comments} = child;
    $a.setAttribute('href', 'https://www.reddit.com' + $link);
    $a.appendChild($d.createTextNode($name || 'No subreddit'));
    $li.appendChild($a);
    $li.appendChild($d.createTextNode(' (' + $comments + ' comment' + ($comments == 1? '': 's') + ')'));
    $ul.appendChild($li);
  }

  document.querySelector('.sidebar').appendChild(frag);
}

if ('fetch' in window) {
  fetch(`//cors-anywhere.herokuapp.com/https://www.reddit.com/api/info.json?url=${window.encodeURIComponent(window.location)}`, {credentials: "omit"})
    .then((r) => r.json())
    .then(({kind, data}) => process_reddit(kind, data));
}
