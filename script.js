
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const job = document.getElementById('job').value.trim();
    const location = document.getElementById('location').value.trim();
    const keywords = document.getElementById('keywords').value.trim().split(',').map(k => k.trim()).filter(k => k);

    const query = `${job} ${location} ${keywords.join(' ')}`;
    const encodedQuery = encodeURIComponent(query);

    const platforms = {
        'LinkedIn': `https://www.google.com/search?q=site:linkedin.com/in+${encodedQuery}`,
        'GitHub': `https://www.google.com/search?q=site:github.com+${encodedQuery}`,
        'StackOverflow': `https://www.google.com/search?q=site:stackoverflow.com/users+${encodedQuery}`,
        'Twitter': `https://www.google.com/search?q=site:twitter.com+${encodedQuery}`
    };

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Search Links:</h2>';
    for (const [platform, url] of Object.entries(platforms)) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = `Search on ${platform}`;
        resultsDiv.appendChild(link);
    }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function saveSearch(title, location, keywords) {
  let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  searches.unshift({ title, location, keywords });
  if (searches.length > 5) searches.pop();
  localStorage.setItem('recentSearches', JSON.stringify(searches));
  displayRecentSearches();
}

function displayRecentSearches() {
  let list = document.getElementById('recent-list');
  if (!list) return;
  list.innerHTML = '';
  let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  searches.forEach(s => {
    let li = document.createElement('li');
    li.textContent = `${s.title} in ${s.location} (${s.keywords})`;
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', displayRecentSearches);

function copyToClipboard(link) {
  navigator.clipboard.writeText(link).then(() => alert('Link copied!'));
}

// Modify generateLinks to include saveSearch and copy buttons
const originalGenerateLinks = generateLinks;
generateLinks = function() {
  const title = document.getElementById('jobTitle').value;
  const location = document.getElementById('location').value;
  const keywords = document.getElementById('keywords').value;
  saveSearch(title, location, keywords);
  originalGenerateLinks();
  document.querySelectorAll('#results a').forEach(a => {
    const btn = document.createElement('button');
    btn.textContent = 'Copy Link';
    btn.className = 'copy-btn';
    btn.onclick = () => copyToClipboard(a.href);
    a.parentNode.insertBefore(btn, a.nextSibling);
  });
}
