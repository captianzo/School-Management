import db from '../config/db.js'

export const addSchool = async (req, res) => {
	const { name, address, latitude, longitude } = req.body;

	if (!name || !address || latitude === undefined || longitude === undefined){
		return res.status(400).json({error: 'All fields are required: name, address, latitude, longitude'});
	}

	if (typeof name !== 'string' || name.trim() === ''){
		return res.status(400).json({error: 'Name must be non-empty'});
	}

	if (typeof address !== 'string' || address.trim() === ''){
		return res.status(400).json({error: 'Address must be non-empty'});
	}

	if (isNaN(latitude) || isNaN(longitude)){
		return res.status(400).json({error: 'Latitude and Longitude must be valid numbers'});
	}

	const parsedLatitude = parseFloat(latitude);
	const parsedLongitude = parseFloat(longitude);

	if (parsedLatitude < -90 || parsedLatitude > 90){
		return res.status(400).json({error: 'Latitude must be between -90 to 90'});
	}

	if (parsedLongitude < -180 || parsedLongitude > 180){
		return res.status(400).json({error: 'Longitude must be between -180 to 180'});
	}

	try {
		const [result] = await db.execute(
			'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
			[name.trim(), address.trim(), parsedLatitude, parsedLongitude]
		);

		res.status(201).json({
			message: 'School added successfully',
			schoolId: result.insertId
		});
	}
	catch (err){
		console.error(err);
		res.status(500).json({error: 'Database Error'});
	}
}