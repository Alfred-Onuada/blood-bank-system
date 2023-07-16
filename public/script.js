window.onload = function (e) {
  const headingMap = { '/': 'home', '/about': 'about', '/contact': 'contact' };
  const currentPage = location.pathname;

  if (Object.keys(headingMap).includes(currentPage)) {
    document.getElementById(headingMap[currentPage]).classList.add('active');
  }
}

function showErrorMsg(msg, elemId) {
  document.getElementById(elemId).classList.remove('hide');
  document.getElementById(elemId).classList.add('shake');
  document.getElementById(elemId).textContent = msg;


  setTimeout(() => {
    document.getElementById(elemId).classList.remove('shake');
    document.getElementById(elemId).classList.add('hide');
    document.getElementById(elemId).textContent = "";
  }, 4000)
}

function register(type) {
  // Tiny magic
  const hospitalIds = ['hospitalNameReg', 'hospitalEmailReg', 'hospitalAddressReg', 'hospitalStateReg', 'hospitalPasswordReg'];
  const hospitalFields = ['hospitalName', 'email', 'address', 'state', 'password'];
  const donorIds = ['donorNameReg', 'donorEmailReg', 'donorPhoneReg', 'donorAgeReg', 'donorBloodGroupReg', 'donorGenotypeReg', 'donorPasswordReg'];
  const donorFields = ['fullName', 'email', 'phone', 'age', 'bloodGroup', 'genotype', 'password'];

  let payload = {};

  if (type == 'hospital') {
    payload = Object.fromEntries(hospitalIds.map((field, idx) => ([hospitalFields[idx], document.getElementById(field).value])))
  } else if (type == 'donor') {
    payload = Object.fromEntries(donorIds.map((field, idx) => ([donorFields[idx], document.getElementById(field).value])))
  } else {
    alert('Invalid action');
    return false;
  }

  fetch(`/auth/register/${type}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showErrorMsg(error, `reg${type}`);
        return;
      }

      location.reload();
    })

  return false;
}

function login(type) {
  // Tiny magic
  const hospitalIds = ['hospitalEmailLogin', 'hospitalPasswordLogin'];
  const donorIds = ['donorEmailLogin', 'donorPasswordLogin'];
  const fields = ['email', 'password'];
  
  let payload = {};

  if (type == 'hospital') {
    payload = Object.fromEntries(hospitalIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))
  } else if (type == 'donor') {
    payload = Object.fromEntries(donorIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))
  } else {
    alert('Invalid action');
    return false;
  }

  fetch(`/auth/login/${type}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showErrorMsg(error, `login${type}`);
        return;
      }

      location.reload();
    })

  return false;
}