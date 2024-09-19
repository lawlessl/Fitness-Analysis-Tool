import { useColorMode } from '@chakra-ui/react';
import { LatLngBounds, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import { Records } from '../interfaces/ActivityData';

interface MapProps {
	records: Records[];
}

const MapComponent: React.FC<MapProps> = ({ records }) => {
	const { colorMode } = useColorMode();
	const positions: LatLngTuple[] = records
		.filter((record) => record.position_lat != null && record.position_long != null)
		.map((record) => [record.position_lat, record.position_long]);

	// Determine the tile layer based on the color mode
	const tileLayerUrl =
		colorMode === 'dark'
			? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
			: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

	// Custom hook to fit bounds
	const FitBoundsToPositions: React.FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
		const map = useMap();

		useEffect(() => {
			if (positions.length > 0) {
				const bounds = new LatLngBounds(positions);
				map.fitBounds(bounds);
			}
		}, [map, positions]);

		return null;
	};

	return (
		<MapContainer
			center={[0, 0]}
			zoom={13}
			style={{ height: '400px', width: '100%' }}
			zoomControl={false}
			scrollWheelZoom={false}
			doubleClickZoom={false}
			dragging={false}
			touchZoom={false}
			keyboard={false}
		>
			<TileLayer
				url={tileLayerUrl}
				attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
			/>
			<Polyline positions={positions} color="#F2F2F2" weight={4} />
			<Polyline positions={positions} color="#2589fb" weight={3} />
			<FitBoundsToPositions positions={positions} />
		</MapContainer>
	);
};

export default MapComponent;
