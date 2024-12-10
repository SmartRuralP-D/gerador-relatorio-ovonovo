const getDevicesTelemetry = async (devices, token) => {
    const telemetryData = {};
    const fetchTelemetryForDevice = async (deviceId, unidade) => {
        const response = await fetch(`https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!telemetryData[unidade]) {
            telemetryData[unidade] = [];
        }
        telemetryData[unidade].push({ deviceId, data });
    };
    const fetchAllTelemetryData = async () => {
        for (const [unidade, deviceIds] of Object.entries(devices)) {
            const fetchPromises = deviceIds.map(deviceId => fetchTelemetryForDevice(deviceId, unidade));
            await Promise.all(fetchPromises);
        }
    };
    await fetchAllTelemetryData();
    return telemetryData;
}
export default getDevicesTelemetry;