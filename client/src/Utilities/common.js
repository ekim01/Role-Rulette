// Prevents non-alphanumeric input
export function restrictInputAlphanumeric(event) {
  const re = /[0-9A-Za-z]+/g;
  if (!re.test(event.key)) {
    event.preventDefault();
  }
}
