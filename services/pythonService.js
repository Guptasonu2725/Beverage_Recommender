const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Call Python ML model to predict beverage
 * @param {Object} data - Input data { weather, mood, temperature, humidity }
 * @returns {Promise<string>} - Predicted beverage name
 */
const predictBeverage = async (data) => {
  return new Promise((resolve, reject) => {
    // Use predict_with_feedback.py - Learns from user feedback!
    const scriptName = 'predict_with_feedback.py';
    const scriptPath = path.join(__dirname, '../python', scriptName);

    // Choose python executable: environment override, then common names
    const pythonCandidates = [process.env.PYTHON_PATH, 'python', 'python3', 'py'].filter(Boolean);
    const pythonExec = pythonCandidates[0];

    if (!fs.existsSync(scriptPath)) {
      return reject(new Error(`Prediction script not found at ${scriptPath}`));
    }

    let timedOut = false;
    const pythonProcess = spawn(pythonExec, [scriptPath, JSON.stringify(data)], { shell: false });

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (chunk) => {
      dataString += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
      errorString += chunk.toString();
    });

    pythonProcess.on('error', (err) => {
      // Happens when the executable is not found or cannot be started
      clearTimeout(killTimer);
      console.error('Failed to start Python process:', err.message || err);
      reject(new Error(`Failed to start Python process: ${err.message || err}`));
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(killTimer);
      if (timedOut) return; // already rejected on timeout

      if (code !== 0) {
        console.error('Python script exited with code', code, 'stderr:', errorString);
        try {
          const parsed = JSON.parse(dataString || '{}');
          if (parsed && parsed.error) {
            return reject(new Error(parsed.error));
          }
        } catch (e) {
          // ignore parse error
        }
        return reject(new Error(`Python script failed with code ${code}: ${errorString || 'no stderr'}`));
      }

      try {
        const result = JSON.parse(dataString.trim());

        if (result.error) {
          return reject(new Error(result.error));
        }

        console.log('🤖 ML Model prediction:', result.prediction);
        resolve(result.prediction);
      } catch (error) {
        console.error('Failed to parse Python output:', dataString, error.message);
        reject(new Error(`Failed to parse prediction: ${error.message}`));
      }
    });

    // Add timeout to prevent hanging
    const killTimer = setTimeout(() => {
      timedOut = true;
      try { pythonProcess.kill(); } catch (e) { /* ignore */ }
      reject(new Error('Python script timeout after 15 seconds'));
    }, 15000);
  });
};

module.exports = {
  predictBeverage
};
