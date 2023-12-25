// function to fetch OCR records on button click
function fetchOCRRecordsOnClick() {
    const historyListDiv = document.getElementById('historyList');
    historyListDiv.innerHTML = '';
    fetch('https://qoalaserver-production.up.railway.app/api/records/')
        .then(response => response.json())
        .then(records => {
            console.log(records); // Log the records to the console
            // Handle the fetched records
            displayOCRRecords(records);
        })
        .catch(error => {
            console.error('Error fetching OCR records:', error);
            historyListDiv.innerHTML = 'Error fetching OCR records.';
        });
}

// event listener for the button click
document.getElementById('fetchRecordsButton').addEventListener('click', fetchOCRRecordsOnClick);

// function to display fetched OCR records
function displayOCRRecords(response) {
    const historyListDiv = document.getElementById('historyList');
    historyListDiv.innerHTML = ''; // Clear previous content

    if (response && response.data && Array.isArray(response.data)) {
        response.data.forEach(record => {
            const recordItem = document.createElement('div');
            recordItem.innerHTML = `
                <p><strong>ID:</strong> ${record.id}</p>
                <p><strong>Prefix:</strong> ${record.prefix}</p>
                <p><strong>First Name:</strong> ${record.firstName}</p>
                <p><strong>Last Name:</strong> ${record.lastName}</p>
                <p><strong>Date of Birth:</strong> ${record.dateOfBirth}</p>
                <p><strong>Issue Date:</strong> ${record.issueDate}</p>
                <p><strong>Expiry Date:</strong> ${record.expiryDate}</p>
                <hr>
            `;
            historyListDiv.appendChild(recordItem);
        });
    } else {
        // Handle the case where the response format is not as expected
        console.error('Invalid data format for OCR records:', response);
        historyListDiv.innerHTML = 'Invalid data format for OCR records.';
    }
}



// function to fetch records after uploading
function uploadAndProcess() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = 'Processing...'
    const file = fileInput.files[0];
    if (!file) {
        alert('Please choose a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://qoalaserver-production.up.railway.app/api/media/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Handle OCR results
        outputDiv.innerHTML = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error processing image:', error);
        outputDiv.innerHTML = 'Error processing image.';
    });
}

function fetchAndUpdate() {
    const recordId = document.getElementById('recordId').value;

    // Display the update form
    displayUpdateForm(recordId);
}

function displayUpdateForm(recordId) {
    const updateForm = document.getElementById('updateForm');
    updateForm.innerHTML = ''; // Clear previous content

    // Display input fields with current values
    const issueDateInput = document.createElement('div');
    issueDateInput.innerHTML = `
        <label for="issueDate">Issue Date:</label>
        <input type="text" id="issueDate" />
    `;
    updateForm.appendChild(issueDateInput);

    const prefixInput = document.createElement('div');
    prefixInput.innerHTML = `
        <label for="prefix">Prefix:</label>
        <input type="text" id="prefix" />
    `;
    updateForm.appendChild(prefixInput);

    const firstNameInput = document.createElement('div');
    firstNameInput.innerHTML = `
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" />
    `;
    updateForm.appendChild(firstNameInput);

    const lastNameInput = document.createElement('div');
    lastNameInput.innerHTML = `
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" />
    `;
    updateForm.appendChild(lastNameInput);

    const dateOfBirthInput = document.createElement('div');
    dateOfBirthInput.innerHTML = `
        <label for="dateOfBirth">Date of Birth:</label>
        <input type="text" id="dateOfBirth" />
    `;
    updateForm.appendChild(dateOfBirthInput);

    const expiryDateInput = document.createElement('div');
    expiryDateInput.innerHTML = `
        <label for="expiryDate">Expiry Date:</label>
        <input type="text" id="expiryDate" />
    `;
    updateForm.appendChild(expiryDateInput);

    const idNumInput = document.createElement('div');
    idNumInput.innerHTML = `
        <label for="id_num">ID Number:</label>
        <input type="text" id="id_num" />
    `;
    updateForm.appendChild(idNumInput);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.onclick = () => updateRecord(recordId);
    updateForm.appendChild(updateButton);

    updateForm.style.display = 'block';
}

function updateRecord(recordId) {
    // Collect updated data from input fields
    const formData = new FormData();
    formData.append('issueDate', document.getElementById('issueDate').value || 'empty');
    formData.append('prefix', document.getElementById('prefix').value || 'empty');
    formData.append('firstName', document.getElementById('firstName').value || 'empty');
    formData.append('lastName', document.getElementById('lastName').value || 'empty');
    formData.append('dateOfBirth', document.getElementById('dateOfBirth').value || 'empty');
    formData.append('expiryDate', document.getElementById('expiryDate').value || 'empty');
    formData.append('id_num', document.getElementById('id_num').value || 'empty');

    const apiUrl = `https://qoalaserver-production.up.railway.app/api/update/${recordId}/`;

    // Logging the details of the request
    console.log('Updating record at API:', apiUrl);
    console.log('Request data:', formData);

    // Sending updated data to the API for the specified recordId
    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        console.log('Response status:', response.status);

        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Failed to update record. Status: ${response.status}`);
        }
    })
    .then(updatedRecord => {
        console.log('Record updated successfully:', updatedRecord);
        alert('Record updated successfully!');
    })
    .catch(error => {
        console.error('Error updating record:', error);
        alert('Error updating record. Check the console for details.');
    });
}


// function to delete a record
function deleteRecord() {
    // Get the ID to be deleted
    const recordId = document.getElementById('deleteId').value;

    // Confirm with the user before proceeding with the deletion
    const confirmDelete = confirm(`Are you sure you want to delete the record with ID ${recordId}?`);
    
    if (!confirmDelete) {
        // If the user cancels the deletion, do nothing
        return;
    }

    // Send a request to delete the record by ID
    fetch(`https://qoalaserver-production.up.railway.app/api/delete/${recordId}/`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            alert(`Record with ID ${recordId} deleted successfully!`);
        } else if (response.status === 404) {
            alert(`Record with ID ${recordId} does not exist.`);
        } else {
            alert(`Error deleting record with ID ${recordId}`);
        }
    })
    .catch(error => {
        console.error('Error deleting record:', error);
        alert('Error deleting record.');
    });
}

