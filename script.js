// simple multi-step + validation + POST to endpoint
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const steps = Array.from(document.querySelectorAll('.step'));
  const msg = document.getElementById('message');
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  let current = 0;
  function showStep(i){
    steps.forEach((s,idx)=> s.classList.toggle('hidden', idx!==i));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  showStep(current);

  // prev / next handlers
  form.addEventListener('click', e=>{
    if(e.target.matches('.next')){
      if(!validateStep(current)) return;
      current = Math.min(steps.length-1, current+1);
      showStep(current);
    } else if(e.target.matches('.prev')){
      current = Math.max(0, current-1);
      showStep(current);
    }
  });

  function validateStep(i){
    const step = steps[i];
    const inputs = Array.from(step.querySelectorAll('[required]'));
    for(const el of inputs){
      if(!el.value.trim()){
        el.focus();
        msg.textContent = 'Vui lòng điền các trường bắt buộc.';
        msg.style.color = 'crimson';
        return false;
      }
    }
    msg.textContent = '';
    return true;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if(!validateStep(current)) return;
    // gather form data
    const data = Object.fromEntries(new FormData(form).entries());
    msg.style.color = 'black';
    msg.textContent = 'Đang gửi...';

    try {
      // TODO: thay URL bằng endpoint của bạn (Apps Script / API)
      const endpoint = 'https://script.google.com/macros/s/AKfycbxksHrPez3ktdHFwxQcZw6xqUxfi4uhtl9iQJZf4bj-dNJYb3gTruNlR2fS-eetHKOOCw/exec';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if(json.result === 'success'){
        msg.style.color = 'green';
        msg.textContent = 'Gửi thành công — cảm ơn bạn!';
        form.reset();
        current = 0;
        showStep(current);
      } else {
        throw new Error(json.error || 'Lỗi server');
      }
    } catch (err){
      console.error(err);
      msg.style.color = 'crimson';
      msg.textContent = 'Gửi thất bại — thử lại sau hoặc liên hệ HR.';
    }
  });
});
