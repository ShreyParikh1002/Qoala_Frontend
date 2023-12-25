// function to fetch OCR records on button click
function fetchOCRRecordsOnClick() {
    const historyListDiv = document.getElementById('historyList');
    historyListDiv.innerHTML = '';
    fetch('https://thaiocr-production.up.railway.app/api/records/')
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

    fetch('https://thaiocr-production.up.railway.app/api/media/', {
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
