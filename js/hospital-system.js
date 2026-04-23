document.addEventListener('DOMContentLoaded',()=>{
  const input=document.querySelector('[data-hospital-search]');
  if(input){
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase();
      document.querySelectorAll('[data-hospital-item]').forEach((el)=>{
        el.style.display=el.textContent.toLowerCase().includes(q)?'':'none';
      });
    });
  }

  document.querySelectorAll('[data-status-toggle]').forEach((btn)=>{
    btn.addEventListener('click',()=>{
      const panel=document.querySelector(btn.getAttribute('data-status-toggle'));
      if(panel){panel.classList.toggle('active');}
    });
  });
});
