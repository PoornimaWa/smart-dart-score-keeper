export function initTheme() {
  const buttons = Array.from(document.querySelectorAll('.theme-toggle')) as HTMLButtonElement[];
  function updateStorageAndBody() {
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      updateStorageAndBody();
    });
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}
