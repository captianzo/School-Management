import db from '../config/db.js';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Earth's radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
		Math.cos((lat2 * Math.PI) / 180) *
		Math.sin(dLon / 2) *
		Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
};

export const listSchools = async (req, res) => {
	const { latitude, longitude } = req.query;

	if (latitude === undefined || longitude === undefined) {
		return res.status(400).json({ error: 'Latitude and Longitude are required as query parameters' });
	}

	const userLatitude = parseFloat(latitude);
	const userLongitude = parseFloat(longitude);

	if (isNaN(userLatitude) || isNaN(userLongitude)) {
		return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
	}

	if (userLatitude < -90 || userLatitude > 90) {
		return res.status(400).json({ error: 'Latitude must be between -90 to 90' });
	}

	if (userLongitude < -180 || userLongitude > 180) {
		return res.status(400).json({ error: 'Longitude must be between -180 to 180' });
	}

	try {
		const [schools] = await db.execute('SELECT * FROM schools');

		const sortedSchools = schools.map((school) => ({
			...school,
			distance: haversineDistance(userLatitude, userLongitude, school.latitude, school.longitude)
		})).sort((a, b) => { a.distance - b.distance });

		res.status(200).json({
			message: 'Schools fetched successfully',
			data: sortedSchools
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Database Error' });
	}
}