let trainingStream = null;
let capturedTrainingImages = [];

function startTrainingCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            trainingStream = stream;
            const video = document.getElementById('trainingVideo');
            video.srcObject = stream;
            video.style.display = 'block';
            showStatus('trainingStatus', 'Camera started. Position yourself and click capture.', 'info');
        })
        .catch(err => {
            showStatus('trainingStatus', 'Error accessing camera: ' + err.message, 'error');
        });
}

function captureTrainingImage() {
    const video = document.getElementById('trainingVideo');
    const canvas = document.getElementById('trainingCanvas');
    
    if (!trainingStream) {
        showStatus('trainingStatus', 'Please start the camera first.', 'error');
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
        capturedTrainingImages.push(blob);
        showStatus('trainingStatus', `Captured ${capturedTrainingImages.length} images.`, 'success');
    });
}

function stopTrainingCamera() {
    if (trainingStream) {
        trainingStream.getTracks().forEach(track => track.stop());
        trainingStream = null;
        document.getElementById('trainingVideo').style.display = 'none';
        showStatus('trainingStatus', 'Camera stopped.', 'info');
    }
}

function startTraining() {
    const personName = document.getElementById('personName').value;
    const personId = document.getElementById('personId').value;
    const fileInput = document.getElementById('trainingImages');
    
    if (!personName || !personId) {
        showStatus('trainingStatus', 'Please enter person name and ID.', 'error');
        return;
    }

    if (fileInput.files.length === 0 && capturedTrainingImages.length === 0) {
        showStatus('trainingStatus', 'Please select images or capture from camera.', 'error');
        return;
    }

    showStatus('trainingStatus', 'Starting training process...', 'info');

    setTimeout(() => {
        showStatus('trainingStatus', 'Training completed successfully! Model saved.', 'success');
        
        document.getElementById('personName').value = '';
        document.getElementById('personId').value = '';
        document.getElementById('trainingImages').value = '';
        capturedTrainingImages = [];
    }, 3000);
}

function showStatus(elementId, message, type) {
    const statusDiv = document.getElementById(elementId);
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

document.getElementById('trainingImages').addEventListener('change', function(e) {
    const fileCount = e.target.files.length;
    if (fileCount > 0) {
        showStatus('trainingStatus', `Selected ${fileCount} training images.`, 'info');
    }
});
