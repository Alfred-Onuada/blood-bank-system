window.onload = function (e) {
  const headingMap = { '/': 'home', '/about': 'about', '/contact': 'contact' };
  const currentPage = location.pathname;

  if (Object.keys(headingMap).includes(currentPage)) {
    document.getElementById(headingMap[currentPage]).classList.add('active');
  }
}

function showMsg(msg, elemId) {
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
        showMsg(error, `reg${type}`);
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
        showMsg(error, `login${type}`);
        return;
      }

      location.reload();
    })

  return false;
}

function requestBlood() {
  const requestIds = ['requestBloodGroup', 'requestGenotype', 'requestQuantity'];
  const fields = ['bloodGroup', 'genotype', 'quantity'];

  let payload = {};

  payload = Object.fromEntries(requestIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))

  fetch(`/user/request`, {
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
        showMsg(error, 'requestFailed');
        return;
      }

      showMsg(data.message, 'requestSuccess');
    })

  return false;
}

function getCenters() {
  const state = document.getElementById('donateState').value;

  fetch(`/user/centers/${state}`)
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'donateFailed');
        return;
      }

      document.getElementById('donateCenter').innerHTML = '';
      
      // populate the select elem
      for (const { hospitalName } of data.data) {
        const node = document.createElement('option');
        node.textContent = hospitalName;
        document.getElementById('donateCenter').appendChild(node)
      }

      document.getElementById('donateCenter').removeAttribute('disabled');
      document.getElementById('donateBtn').removeAttribute('disabled');
    })
}

function giveBlood() {
  const requestIds = ['donateQuantity', 'donateDate', 'donateState', 'donateCenter'];
  const fields = ['quantity', 'date', 'state', 'center'];

  let payload = {};

  payload = Object.fromEntries(requestIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))

  fetch(`/user/donate`, {
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
        showMsg(error, 'donateFailed');
        return;
      }

      showMsg(data.message, 'donateSuccess');
    })

  return false;
}