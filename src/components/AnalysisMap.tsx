// AnalysisMap.tsx
import { useColorMode } from '@chakra-ui/react';
import { DivIcon, LatLngBounds, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import Checkerboard_pattern from '../assets/images/Checkerboard_pattern.svg';
import Square_green from '../assets/images/Square_green.svg';
import './AnalysisMap.css';

interface AnalysisMapProps {
	positions: LatLngTuple[];
	highlightInterval: { start: number; end: number } | null;
	isMapInitialized: boolean;
	toggleFitBounds: boolean;
	fitBoundsType: string;
	mouseIndex: number | null;
}

const AnalysisMap: React.FC<AnalysisMapProps> = ({
	positions,
	highlightInterval,
	isMapInitialized,
	toggleFitBounds,
	fitBoundsType,
	mouseIndex,
}) => {
	const { colorMode } = useColorMode();

	const checkerboardIcon = new DivIcon({
		className: 'custom-icon',
		html: `
                  <div style="
                    width: 17px;
                    height: 17px;
                    background-image: url(${Checkerboard_pattern});
             	       background-size: cover;
                    border-radius: 50%;
                    border: 2px solid white;
                  "></div>`,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
	});

	const startIcon = new DivIcon({
		className: 'custom-icon',
		html: `
                  <div style="
                    width: 17px;
                    height: 17px;
                    background-image: url(${Square_green});
                    background-size: cover;
                    border-radius: 50%;
                    border: 2px solid white;
                  "></div>`,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
	});

	const tileLayers = {
		Street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		Dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
		Light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	};

	type TileLayerType = keyof typeof tileLayers;

	const [selectedTileLayer, setSelectedTileLayer] = useState(tileLayers.Street);
	const [mapKey, setMapKey] = useState(0);
	const [mapCenter, setMapCenter] = useState<LatLngTuple>([0, 0]); // Preserve map center

	const handleTileLayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedMapType = event.target.value as TileLayerType;
		setSelectedTileLayer(tileLayers[selectedMapType]);
		setMapKey((prevKey) => prevKey + 1);

		const bounds = new LatLngBounds(positions);
		const center = bounds.getCenter();
		setMapCenter([center.lat, center.lng]);
	};

	// Extract highlighted positions based on the highlightInterval without removing the original polyline
	const highlightedPositions = useMemo(() => {
		if (highlightInterval) {
			return positions.slice(highlightInterval.start, highlightInterval.end + 1);
		}
		return [];
	}, [positions, highlightInterval]);

	const FitBoundsToPositions: React.FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
		const map = useMap();
		const boundsSetRef = useRef(false);

		useEffect(() => {
			if (positions.length > 0 && !boundsSetRef.current && (!isMapInitialized || toggleFitBounds)) {
				const bounds = new LatLngBounds(positions);
				map.fitBounds(bounds);
				boundsSetRef.current = true;
			}
		}, [map, positions]);

		return null;
	};

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			{/* Dropdown for selecting map type. Kinda jank but i dont want */}
			<div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
				<div className="select-wrapper">
					<select onChange={handleTileLayerChange} className="select-box">
						<option value="Street">Street Map</option>
						<option value="Satellite">Satellite</option>
						{colorMode === 'light' ? <option value="Light">Simple</option> : <option value="Dark">Simple</option>}
					</select>
					<div className="chevron" />
				</div>
			</div>
			<MapContainer
				key={mapKey} // Add key to force re-render on map type change
				center={mapCenter}
				zoom={12}
				style={{ height: '400px', width: '100%' }}
				zoomSnap={0.7}
				zoomDelta={0.7}
			>
				{/* Tile layer based on selected option */}
				<TileLayer
					url={selectedTileLayer}
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>

				{/* Render the entire polyline with the default color */}
				<Polyline positions={positions} color={'#2589fb'} />

				{/* Overlay the highlighted section */}
				{highlightedPositions.length > 0 && <Polyline positions={highlightedPositions} color={'#ea0401'} />}
				{fitBoundsType === 'full' ? (
					<FitBoundsToPositions positions={positions} />
				) : fitBoundsType === 'highlight' ? (
					<FitBoundsToPositions positions={highlightedPositions} />
				) : null}
				<Marker position={positions[0]} icon={startIcon} />
				<Marker position={positions[positions.length - 1]} icon={checkerboardIcon} />
				{mouseIndex !== null && (
					<CircleMarker
						center={positions[mouseIndex]}
						radius={7}
						pathOptions={{ color: 'white', weight: 2, fillColor: '#fc5201', fillOpacity: 1 }}
					/>
				)}
			</MapContainer>
		</div>
	);
};

export default AnalysisMap;
