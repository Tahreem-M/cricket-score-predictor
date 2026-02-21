/**
 * Cricket Score Predictor - Frontend Logic
 */

const config = {
    ppRuns: { min: 30, max: 70, default: 50 },
    ppWkts: { min: 0, max: 3, default: 1 },
    venueAvg: { min: 140, max: 190, default: 165 }
};

// Score labels by range
function getScoreLabel(score) {
    if (score < 140) return 'Below Par';
    if (score < 160) return 'Competitive';
    if (score < 180) return 'Strong Total';
    if (score <= 200) return 'Excellent Total';
    return 'Match-Winning Total';
}

// Sync slider and number input
function syncInputs(sliderId, numId, warnId, min, max) {
    const slider = document.getElementById(sliderId);
    const num = document.getElementById(numId);
    const warn = document.getElementById(warnId);

    function updateFromSlider() {
        num.value = slider.value;
        validateInput(num, min, max, warn);
    }

    function updateFromNum() {
        const val = parseInt(num.value, 10);
        if (isNaN(val) || val < min || val > max) return;
        slider.value = val;
        validateInput(num, min, max, warn);
    }

    slider.addEventListener('input', updateFromSlider);
    num.addEventListener('input', updateFromNum);
}

function validateInput(numEl, min, max, warnEl) {
    const val = parseInt(numEl.value, 10);
    if (isNaN(val) || val < min || val > max) {
        warnEl.textContent = `Value must be between ${min} and ${max}`;
        warnEl.classList.remove('hidden');
        return false;
    }
    warnEl.textContent = '';
    warnEl.classList.add('hidden');
    return true;
}

// Validate all inputs before submit
function validateAll() {
    const ppRuns = parseInt(document.getElementById('ppRunsNum').value, 10);
    const ppWkts = parseInt(document.getElementById('ppWktsNum').value, 10);
    const venueAvg = parseInt(document.getElementById('venueAvgNum').value, 10);

    const warn = (msg) => {
        alert(msg);
        return false;
    };

    if (isNaN(ppRuns) || ppRuns < config.ppRuns.min || ppRuns > config.ppRuns.max) {
        return warn(`PP Runs must be between ${config.ppRuns.min} and ${config.ppRuns.max}`);
    }
    if (isNaN(ppWkts) || ppWkts < config.ppWkts.min || ppWkts > config.ppWkts.max) {
        return warn(`PP Wickets must be between ${config.ppWkts.min} and ${config.ppWkts.max}`);
    }
    if (isNaN(venueAvg) || venueAvg < config.venueAvg.min || venueAvg > config.venueAvg.max) {
        return warn(`Venue Average must be between ${config.venueAvg.min} and ${config.venueAvg.max}`);
    }
    return true;
}

// Chart.js bar chart
let barChart = null;

function renderChart(lrScore, rfScore) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Linear Regression', 'Random Forest'],
            datasets: [{
                label: 'Predicted Score',
                data: [lrScore, rfScore],
                backgroundColor: ['#f0c040', '#d4a030'],
                borderColor: ['#f0c040', '#d4a030'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(45, 74, 45, 0.5)' },
                    ticks: { color: '#b0c4b0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#b0c4b0' }
                }
            }
        }
    });
}

function updateResults(data) {
    const lrScore = data.linear_regression;
    const rfScore = data.random_forest;

    document.getElementById('lrScore').textContent = lrScore;
    document.getElementById('lrR2').textContent = `R² ${data.lr_r2}`;
    document.getElementById('lrLabel').textContent = getScoreLabel(lrScore);

    document.getElementById('rfScore').textContent = rfScore;
    document.getElementById('rfR2').textContent = `R² ${data.rf_r2}`;
    document.getElementById('rfLabel').textContent = getScoreLabel(rfScore);

    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('placeholderText').classList.add('hidden');

    renderChart(lrScore, rfScore);
}

function resetForm() {
    document.getElementById('ppRuns').value = config.ppRuns.default;
    document.getElementById('ppRunsNum').value = config.ppRuns.default;

    document.getElementById('ppWkts').value = config.ppWkts.default;
    document.getElementById('ppWktsNum').value = config.ppWkts.default;

    document.getElementById('venueAvg').value = config.venueAvg.default;
    document.getElementById('venueAvgNum').value = config.venueAvg.default;

    document.getElementById('ppRunsWarn').classList.add('hidden');
    document.getElementById('ppWktsWarn').classList.add('hidden');
    document.getElementById('venueAvgWarn').classList.add('hidden');
}

// Fetch prediction
async function handlePredict(e) {
    e.preventDefault();
    if (!validateAll()) return;

    const btn = document.getElementById('predictBtn');
    btn.disabled = true;
    btn.classList.add('loading');

    const payload = {
        pp_runs: parseInt(document.getElementById('ppRunsNum').value, 10),
        pp_wkts: parseInt(document.getElementById('ppWktsNum').value, 10),
        venue_avg: parseInt(document.getElementById('venueAvgNum').value, 10)
    };

    try {
        const res = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.detail || 'Request failed');
        }

        updateResults(data);
    } catch (err) {
        alert('Error: ' + (err.message || 'Could not reach server'));
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    syncInputs('ppRuns', 'ppRunsNum', 'ppRunsWarn', config.ppRuns.min, config.ppRuns.max);
    syncInputs('ppWkts', 'ppWktsNum', 'ppWktsWarn', config.ppWkts.min, config.ppWkts.max);
    syncInputs('venueAvg', 'venueAvgNum', 'venueAvgWarn', config.venueAvg.min, config.venueAvg.max);

    document.getElementById('predictForm').addEventListener('submit', handlePredict);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
});
