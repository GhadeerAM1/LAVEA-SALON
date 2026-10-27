// LAVÉA booking form connected to Supabase.
const SUPABASE_URL = "https://zerwymznhojeaeyrggnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_L7sKCa3zTelmLbDdB3XawA_oK8V5pKb";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const demoServices = [
  'مساج سويدي','مساج علاجي','مساج أحجار ساخنة','مكياج بناتي','مكياج سهرة','مكياج خفيف',
  'بلياج','رنساج','صبغة لون واحد','قص غرة','قص شعر','تحديد بالمكينة','استشوار قصير','استشوار وسط','استشوار طويل',
  'مناكير وبديكير كلاسيك','مناكير وبديكير سبا','مناكير وبديكير علاجي','تشقير وصبغة الحواجب','رموش شهرية','رموش يومية',
  'تسريحة','معالجات الشعر','قص شعر + مكياج سهرة'
];
const serviceSelect = document.getElementById('service');
demoServices.forEach(name => { const o=document.createElement('option'); o.value=name; o.textContent=name; serviceSelect.appendChild(o); });
const dateInput=document.getElementById('date');
const timeSelect=document.getElementById('time');
const now=new Date(); dateInput.min=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
for(let h=12;h<24;h++){const o=document.createElement('option');o.value=String(h).padStart(2,'0')+':00';o.textContent=String(h%12||12)+':00 '+(h<12?'ص':'م');timeSelect.appendChild(o)}
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.service;let option=[...serviceSelect.options].find(o=>o.value===name);if(!option){option=document.createElement('option');option.value=name;option.textContent=name;serviceSelect.appendChild(option)}serviceSelect.value=name;document.getElementById('booking').scrollIntoView({behavior:'smooth'});}));
const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');
const bookingSubmitButton = bookingForm.querySelector('button[type="submit"]');
bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const formData = new FormData(bookingForm);
  const booking = {
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    service: String(formData.get('service') || '').trim(),
    booking_date: String(formData.get('date') || ''),
    booking_time: String(formData.get('time') || ''),
    notes: String(formData.get('notes') || '').trim() || null,
    status: 'Pending'
  };
  bookingMessage.textContent = 'جارٍ إرسال طلب الحجز…';
  bookingMessage.dataset.state = 'loading';
  bookingSubmitButton.disabled = true;
  try {
    const { error } = await supabaseClient.from('bookings').insert([booking]);
    if (error) throw error;
    bookingMessage.textContent = 'تم إرسال طلب الحجز بنجاح! سنتواصل معكِ لتأكيد الموعد.';
    bookingMessage.dataset.state = 'success';
    bookingForm.reset();
    dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  } catch (error) {
    console.error('LAVÉA booking submit error:', error);
    if (error && (error.code === '42501' || /row-level security|permission denied/i.test(error.message || ''))) {
      bookingMessage.textContent = 'تعذر إرسال الحجز بسبب صلاحيات قاعدة البيانات. يلزم تفعيل صلاحية INSERT للزوار على جدول bookings في Supabase.';
    } else if (error && /fetch|network/i.test(error.message || '')) {
      bookingMessage.textContent = 'تعذر الاتصال بقاعدة البيانات. تحققي من الاتصال بالإنترنت وإعدادات Supabase.';
    } else {
      bookingMessage.textContent = 'تعذر حفظ الحجز. تحققي من أعمدة جدول bookings في Supabase ثم حاولي مرة أخرى.';
    }
    bookingMessage.dataset.state = 'error';
  } finally {
    bookingSubmitButton.disabled = false;
  }
});
