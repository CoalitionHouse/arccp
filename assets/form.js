/* form.js — Quote form mailto handler for ARCCP
   Collects all fields and opens a pre-filled mailto: link
   to info@amaravatirccpipes.com */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name     = (form.querySelector('[name="name"]')     || {}).value || '';
    var company  = (form.querySelector('[name="company"]')  || {}).value || '';
    var phone    = (form.querySelector('[name="phone"]')    || {}).value || '';
    var email    = (form.querySelector('[name="email"]')    || {}).value || '';
    var state    = (form.querySelector('[name="state"]')    || {}).value || '';
    var cls      = (form.querySelector('[name="pipe_class"]')|| {}).value || '';
    var dia      = (form.querySelector('[name="dia_qty"]')  || {}).value || '';
    var msg      = (form.querySelector('[name="message"]')  || {}).value || '';

    var to      = 'info@amaravatirccpipes.com';
    var subject = 'Quotation Request' + (company ? ' — ' + company : '') + (state ? ' | ' + state : '');

    var body = [
      'Dear Amaravati RCC Pipes Team,',
      '',
      'Please find below our quotation enquiry details:',
      '',
      'Name         : ' + name,
      'Company      : ' + (company || '—'),
      'Phone        : ' + phone,
      'Email        : ' + (email || '—'),
      'Project State: ' + (state  || '—'),
      'Pipe Class   : ' + (cls    || '—'),
      'Dia & Qty    : ' + (dia    || '—'),
      '',
      'Additional Details:',
      msg || '—',
      '',
      'Thank you,',
      name
    ].join('\n');

    var mailto = 'mailto:' + to
      + '?subject=' + encodeURIComponent(subject)
      + '&body='    + encodeURIComponent(body);

    window.location.href = mailto;

    // Visual feedback
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = '✓ Opening your email app…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
      }, 3500);
    }
  });
});
