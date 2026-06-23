document.getElementById('searchButton').addEventListener('click', parseInput);
document.getElementById('searchInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    parseInput();
  }
});

function parseInput() {
  const inputField = document.getElementById('searchInput');
  const warning = document.getElementById('warningMessage');
  const input = inputField.value.trim();

  // Clear any previous warning
  warning.textContent = '';

  // If nothing is entered, show warning and return
  if (!input) {
    warning.textContent = 'Please enter first author name';
    return;
  }

  // Remove plus signs
  const cleaned = input.replace(/\+/g, '');

  // Separate digit part and text part
  const match = cleaned.match(/(\d+)/);
  let digits = '';
  let text = cleaned;

  if (match) {
    digits = match[1];
    text = cleaned.replace(match[0], '').trim();
  }

  // Remove leading/trailing punctuation
  text = text.replace(/^[^\w]+|[^\w]+$/g, '').trim();

  // Handle 2-digit year rule
  const currentYear = Number(
    Intl.DateTimeFormat('en', { year: 'numeric' }).format()
  );
  const lastTwo = currentYear % 100;
  const num = parseInt(digits, 10);

  if (digits.length === 2 && !isNaN(num)) {
    digits = num <= lastTwo ? `20${digits}` : `19${digits}`;
  }

  // Build the target URL
  const baseUrl = "https://ui.adsabs.harvard.edu/search/filter_database_fq_database=AND&filter_database_fq_database=database%3A%22astronomy%22&filter_property_fq_property=AND&filter_property_fq_property=property%3A%22refereed%22&fq=%7B!type%3Daqp%20v%3D%24fq_database%7D&fq=%7B!type%3Daqp%20v%3D%24fq_property%7D&fq_database=(database%3A%22astronomy%22)&fq_property=(property%3A%22refereed%22)&p_=0";
  let query = `&q=first_author%3A%22${encodeURIComponent(text)}%22`;
  if (digits) {
    query += `%20year%3A${encodeURIComponent(digits)}`;
  }
  const fullUrl = baseUrl + query;

  // // Display results
  // resultDiv.innerHTML = `
  //   Original: ${input}
  //   Text part: ${text || '(none)'}
  //   Digits part: ${digits || '(none)'}
  // `;

  // Redirect
  window.location.href = fullUrl;
}
