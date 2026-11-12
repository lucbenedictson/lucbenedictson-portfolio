// Copy the email address when its button is pressed.
document.querySelectorAll('.copy').forEach(function (button) {
  var email = button.dataset.email;

  button.addEventListener('click', function () {
    if (!navigator.clipboard) return selectText(button);
    navigator.clipboard.writeText(email).then(function () {
      button.textContent = 'Copied';
      setTimeout(function () { button.textContent = email; }, 1600);
    }, function () { selectText(button); });
  });
});

function selectText(element) {
  var range = document.createRange();
  range.selectNodeContents(element);
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
