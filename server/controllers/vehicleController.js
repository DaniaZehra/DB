import Vehicle from '../services/vehicle.js';

export const addVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;

    // Call the service function to add the vehicle
    const result = await Vehicle.addVehicleService(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding vehicle.',
      error: error.message,
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;

    // Call the service function to update the vehicle
    const result = await Vehicle.updateVehicleService(vehicleData);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle.',
      error: error.message,
    });
  }
};
