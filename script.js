// function to fetch OCR records on button click
function fetchOCRRecordsOnClick() {
    const historyListDiv = document.getElementById('historyList');
    historyListDiv.innerHTML = '';
    fetch('https://qoalaserver-production.up.railway.app/api/records/')
        .then(response => response.json())
        .then(records => {
            console.log(records); // Log the records to the console
            // Handle the fetched records
            displayOCRRecords(records,historyListDiv);
        })
        .catch(error => {
            console.error('Error fetching OCR records:', error);
            historyListDiv.innerHTML = 'Error fetching OCR records.';
        });
}

// event listener for the button click
document.getElementById('fetchRecordsButton').addEventListener('click', fetchOCRRecordsOnClick);

// function to display fetched OCR records
function displayOCRRecords(response,place) {
    // const historyListDiv = document.getElementById('historyList');
    place.innerHTML = ''; // Clear previous content

    if (response && response.data && Array.isArray(response.data)) {
        response.data.forEach(record => {
            const recordItem = document.createElement('div');
            recordItem.innerHTML = `
                <p><strong>Status:</strong> Success </p>
                <p><strong>ID:</strong> ${record.id}</p>
                <p><strong>Prefix:</strong> ${record.prefix}</p>
                <p><strong>First Name:</strong> ${record.firstName}</p>
                <p><strong>Last Name:</strong> ${record.lastName}</p>
                <p><strong>Date of Birth:</strong> ${record.dateOfBirth}</p>
                <p><strong>Issue Date:</strong> ${record.issueDate}</p>
                <p><strong>Expiry Date:</strong> ${record.expiryDate}</p>
                <p><strong>id_num:</strong> ${record.id_num}</p>
                <hr>
            `;
            place.appendChild(recordItem);
        });
    } else {
        // Handle the case where the response format is not as expected
        console.error('Invalid data format for OCR records:', response);
        place.innerHTML = 'Invalid data format for OCR records.';
    }
}



// function to fetch records after uploading
function uploadAndProcess() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');
    
    const file = fileInput.files[0];
    if (!file) {
        alert('Please choose a file.'); 
        return;
    }
    else{
        outputDiv.innerHTML = 'Processing, Please wait (may take upto 3 minutes)';
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://qoalaserver-production.up.railway.app/api/media/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has a 'result' property
        if (data && data.result) {
            
            displayOCRRecords({ data: [data.result] }, outputDiv);
            fileInput.value = '';
        } else {
            // Handle the case where the response format is not as expected
            console.error('Invalid data format for OCR result:', data);
            outputDiv.innerHTML = 'Invalid data format for OCR result.';
        }
    })
    .catch(error => {
        console.error('Error processing image:', error);
        outputDiv.innerHTML = 'Error processing image.';
    });
}

function fetchAndUpdate() {
    const recordIdInput = document.getElementById('recordId');
    const recordId = recordIdInput.value;

    if (!recordId) {
        // If no ID is entered, show an alert
        alert('Please enter a Record ID.');
        return;
    }
    else{
        // Displaying the update form
        displayUpdateForm(recordId);
    }

    // Checking if the update button should change text
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.textContent = 'Select Another ID';
    }

    
}

function displayUpdateForm(recordId) {
    const updateForm = document.getElementById('updateForm');
    updateForm.innerHTML = ''; // Clear previous content

    // Fetch all records
    fetch('https://qoalaserver-production.up.railway.app/api/records/')
        .then(response => response.json())
        .then(records => {
            // Find the record with the specified ID
            const record = records.data.find(record => record.id === parseInt(recordId));


            if (record) {
                // Display input fields with current values
                const issueDateInput = createInput('Issue Date:', 'issueDate', record.issueDate);
                updateForm.appendChild(issueDateInput);

                const prefixInput = createInput('Prefix:', 'prefix', record.prefix);
                updateForm.appendChild(prefixInput);

                const firstNameInput = createInput('First Name:', 'firstName', record.firstName);
                updateForm.appendChild(firstNameInput);

                const lastNameInput = createInput('Last Name:', 'lastName', record.lastName);
                updateForm.appendChild(lastNameInput);

                const dateOfBirthInput = createInput('Date of Birth:', 'dateOfBirth', record.dateOfBirth);
                updateForm.appendChild(dateOfBirthInput);

                const expiryDateInput = createInput('Expiry Date:', 'expiryDate', record.expiryDate);
                updateForm.appendChild(expiryDateInput);

                const idNumInput = createInput('ID Number:', 'id_num', record.id_num);
                updateForm.appendChild(idNumInput);

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.onclick = () => updateRecord(recordId);
                updateForm.appendChild(updateButton);

                updateForm.style.display = 'block';
            } else {
                alert(`Record with ID ${recordId} not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching records:', error);
            alert('Error fetching records.');
        });
}

function createInput(labelText, inputId, value) {
    const inputContainer = document.createElement('div');
    inputContainer.innerHTML = `
        <label for="${inputId}">${labelText}</label>
        <input type="text" id="${inputId}" value="${value || ''}" />
    `;
    return inputContainer;
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
    if (!recordId) {
        // If no ID is entered, show an alert
        alert('Please enter a Record ID.');
        return;
    }
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

