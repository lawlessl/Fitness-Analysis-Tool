// AnalysisComponent.tsx
import {
	Box,
	Flex,
	Spacer,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import * as d3 from 'd3';
import { LatLngTuple } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { formatStatNumber } from '../../utils/AnalysisUtils';
import AnalysisMap from '../AnalysisMap';

interface MetricData {
	values: number[];
	color: string;
	unit: string;
}

interface ChartData {
	[key: string]: MetricData;
}

interface AnalysisComponentProps {
	data: ChartData;
	brickHeight: number;
	latlng: LatLngTuple[];
}

const AnalysisComponent: React.FC<AnalysisComponentProps> = ({ data, brickHeight, latlng }) => {
	// Chart States
	const chartRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState<number>(0);
	const [hoverData, setHoverData] = useState<{ [key: string]: number | null }>({});
	const [intervalData, setIntervalData] = useState<{
		[key: string]: { min: number; max: number; avg: number } | undefined;
	}>({});

	// States for the leaflet map
	const [highlightInterval, setHighlightInterval] = useState<{ start: number; end: number } | null>(null);
	const [isMapInitialized, setIsMapInitialized] = useState(false); // State to call fitBounds on intialization
	const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(false); // state to trigger FitBounds
	const [boundsType, setBoundsType] = useState<string>('full'); // Indicate to the map which interval to zoom to
	const [mouseIndex, setMouseIndex] = useState<number | null>(null);
	const margin = { top: 40, right: 0, bottom: 0, left: 0 };

	// Defining outside function because it needs to be used by x axis tick labels, uCMV wont work on them :/
	const { colorMode } = useColorMode();
	const useToggleValue = (lightValue: number | string, darkValue: number | string) => {
		return colorMode === 'light' ? lightValue : darkValue;
	};

	// colors
	const brickBackgroundColor = useColorModeValue('#ffffff', '#2c313d');
	const statBackgroundColor = useColorModeValue('#f8f8f8', '#1a202c');
	const cursorStatBackgroundColor = useColorModeValue('#ffffff', '#252f42');
	const topAxisBarColor = useColorModeValue('#eeeeee', '#282828');
	const chartBorderColors = useColorModeValue('#f0f0f0', '#000000');
	const chartStrokeOpacity = useToggleValue(0.7, 0.9);
	const chartFillOpacity = useToggleValue(0.2, 0.4);

	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (!data || !chartRef.current || containerWidth === 0) return;

		const svg = d3.select(chartRef.current);
		svg.selectAll('*').remove();

		const keys = Object.keys(data).filter((key) => key !== 'Distance');
		const xData = data.Distance.values;

		const width = containerWidth - margin.left - margin.right;
		const xScale = d3
			.scaleLinear()
			.domain([d3.min(xData)!, d3.max(xData)!])
			.range([0, width]);

		const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

		const yScales = keys.map((key) => {
			const yData = data[key].values;
			return d3
				.scaleLinear()
				.domain([d3.min(yData)! * 0.95, d3.max(yData)! * 1.05])
				.range([brickHeight, 0]);
		});

		const initialIntervalData = keys.reduce((acc, key) => {
			const yData = data[key].values;
			acc[key] = {
				min: d3.min(yData)!,
				max: d3.max(yData)!,
				avg: d3.mean(yData)!,
			};
			return acc;
		}, {} as { [key: string]: { min: number; max: number; avg: number } });
		setIntervalData(initialIntervalData);

		keys.forEach((key, i) => {
			const dataObj = data[key];
			const yData = dataObj.values;
			const yScale = yScales[i];

			const area = d3
				.area()
				.x((_: unknown, idx: number) => xScale(xData[idx]))
				.y0(brickHeight)
				.y1((d: number) => yScale(d));

			const brickGroup = chartGroup
				.append('g')
				.attr('class', `brick-${i}`)
				.attr('transform', `translate(0, ${i * (brickHeight + 2)})`);

			// Background for each chart
			brickGroup
				.append('rect')
				.attr('width', width)
				.attr('height', brickHeight)
				.attr('fill', brickBackgroundColor) // Background color for each chart
				.attr('opacity', 1);

			brickGroup
				.append('path')
				.datum(yData)
				.attr('fill', dataObj.color)
				.attr('fill-opacity', chartFillOpacity) // Fill opacity
				.attr('stroke', dataObj.color)
				.attr('stroke-width', 0.75)
				.attr('stroke-opacity', chartStrokeOpacity) // Edge opacity
				.attr('d', area);

			// Axis styling
			if (i === 0) {
				const xAxis = d3.axisTop(xScale);

				brickGroup.append('g').attr('class', 'x-axis').attr('transform', `translate(0, 0)`).call(xAxis);

				// Change the color of the axis line
				brickGroup.select('.x-axis path').style('stroke', '#f8f8f8');

				// Change the color of the tick lines
				brickGroup.selectAll('.x-axis .tick line').style('stroke', '#999999');

				// Change the color of the tick labels
				if (colorMode == 'light') {
					brickGroup
						.selectAll('.x-axis .tick text')
						.style('fill', '#000000') // Black label color
						.style('font-size', '12px') // Font size
						.style('font-weight', 'bold'); // Font weight
				} else {
					brickGroup
						.selectAll('.x-axis .tick text')
						.style('fill', '#ffffff') // White label color
						.style('font-size', '12px') // Font size
						.style('font-weight', 'bold'); // Font weight
				}
			}

			// Add a bottom border to all bricks
			brickGroup
				.append('rect')
				.attr('width', width)
				.attr('height', 2)
				.attr('fill', chartBorderColors)
				.attr('y', brickHeight); // Position the border at the bottom of the brick
		});

		const brush = d3
			.brushX()
			.extent([
				[0, 0],
				[width, brickHeight * keys.length + (Object.keys(data).length - 1) * 2],
			])
			.on('brush', brushing)
			.on('end', brushed);

		const brushGroup = chartGroup.append('g').attr('class', 'brush').call(brush);

		// Couldnt find a single resource online for how to type a d3 brush event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function brushing(event: any) {
			if (event.selection) {
				const [x0, x1] = event.selection;

				// Enforce the min zoom width
				const newDomain = [xScale.invert(x0), xScale.invert(x1)];

				// Calculate indices for the newDomain
				const bisect = d3.bisector((d: number) => d).left;
				const startIdx = bisect(xData, newDomain[0]);
				const endIdx = bisect(xData, newDomain[1]);

				const adjustedStartIdx = Math.max(0, startIdx);
				const adjustedEndIdx = Math.min(xData.length - 1, endIdx);

				// Highlight interval for leaflet polyline
				const newHighlightInterval = { start: adjustedStartIdx, end: adjustedEndIdx };
				setHighlightInterval(newHighlightInterval);

				setMouseIndex(endIdx);
			}
		}

		// Couldnt find a single resource online for how to type a d3 brush event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function brushed(event: any) {
			if (event.selection) {
				const [x0, x1] = event.selection;

				// Enforce the min zoom width
				const newDomain = [xScale.invert(x0), xScale.invert(x1)];
				if (newDomain[1] - newDomain[0] > 0.01) {
					// Transition xScale
					xScale.domain(newDomain);

					// Calculate indices for the newDomain
					const bisect = d3.bisector((d: number) => d).left;
					const startIdx = bisect(xData, newDomain[0]);
					const endIdx = bisect(xData, newDomain[1]);

					const adjustedStartIdx = Math.max(0, startIdx);
					const adjustedEndIdx = Math.min(xData.length - 1, endIdx);

					updateChart(() => {
						brushGroup.call(brush.move, null);

						const filteredData = keys.map((key) => {
							const yData = data[key].values.filter(
								(_, idx) => xData[idx] >= newDomain[0] && xData[idx] <= newDomain[1]
							);
							const average = d3.mean(yData)!;
							const min = d3.min(yData)!;
							const max = d3.max(yData)!;
							return { min, max, avg: average };
						});
						setIntervalData(
							keys.reduce((acc, key, i) => {
								acc[key] = filteredData[i];
								return acc;
							}, {} as { [key: string]: { min: number; max: number; avg: number } })
						);

						// Highlight interval for leaflet polyline
						const newHighlightInterval = { start: adjustedStartIdx, end: adjustedEndIdx };
						setHighlightInterval(newHighlightInterval);

						// Set state to trigger FitBoundsToPosition in AnalysisMap
						setShouldFitBounds(true);
						setBoundsType('highlight');

						// Toggle the polyLine cursor dot off so the highlighted polyline is not drawn on top of it
						setMouseIndex(null);
					});
				} else {
					// Remove the brush if the user tries brushing at the max zoom level
					brushGroup.call(brush.move, null);
				}
			}
		}

		const line = svg
			.append('line')
			.attr('class', 'mouse-line')
			.style('stroke', 'black')
			.style('stroke-width', '1px')
			.style('pointer-events', 'none')
			.style('opacity', 0);

		svg
			.on('mouseover', () => {
				line.style('opacity', 1);
			})
			.on('mousemove', (event: MouseEvent) => {
				const [mouseX] = d3.pointer(event);
				const adjustedMouseX = mouseX - margin.left;
				const clampedMouseX = Math.max(0, Math.min(adjustedMouseX, width));
				const xValue = xScale.invert(clampedMouseX);

				const bisect = d3.bisector((d: number) => d).left;
				const i = bisect(data.Distance.values, xValue);

				// Send the mouse index to the leaflet map
				setMouseIndex(i);

				const newHoverData: { [key: string]: number | null } = {};
				keys.forEach((key) => {
					const yData = data[key].values;
					newHoverData[key] = yData[i] !== undefined ? yData[i] : null;
				});
				setHoverData(newHoverData);

				// Keep the data associated with the nearest index, but always draw the line on the user's cursor for better appearance
				line
					.attr('x1', xScale(xValue) + margin.left) // xScale(data.x.values[i]) + margin.left
					.attr('x2', xScale(xValue) + margin.left) // xScale(data.x.values[i]) + margin.left
					.attr('y1', margin.top)
					.attr('y2', brickHeight * keys.length + margin.top + (Object.keys(data).length - 1) * 2);
			})
			.on('mouseout', () => {
				line.style('opacity', 0);
				setHoverData(
					keys.reduce((acc, key) => {
						acc[key] = null;
						return acc;
					}, {} as { [key: string]: number | null })
				);

				// Remove the tracer from the leaflet map by setting the mouseIndex to null
				setMouseIndex(null);
			});

		svg.on('dblclick', () => {
			xScale.domain([d3.min(xData)!, d3.max(xData)!]);
			updateChart(() => {
				setIntervalData(initialIntervalData);
				setHighlightInterval(null);
				setShouldFitBounds(true); // Trigger fitBounds when resetting to full view
				setBoundsType('full');
			});
		});

		function updateChart(callback?: () => void) {
			keys.forEach((key, i) => {
				const yData = data[key].values;
				const yScale = yScales[i];

				const area = d3
					.area()
					.x((_: unknown, idx: number) => xScale(xData[idx]))
					.y0(brickHeight)
					.y1((d: number) => yScale(d));

				svg.select(`.brick-${i} path`).datum(yData).attr('d', area);

				// Top axis styling
				if (i === keys.length - 1) {
					const xAxis = d3.axisTop(xScale);

					svg.select('.x-axis').call(xAxis);

					// Reapply the styles after updating the axis
					svg.select('.x-axis path').style('stroke', '#f8f8f8'); // Axis line color

					svg.selectAll('.x-axis .tick line').style('stroke', '#999999'); // Tick line color

					if (colorMode == 'light') {
						svg
							.selectAll('.x-axis .tick text')
							.style('fill', '#000000') // Black label color
							.style('font-size', '12px') // Font size
							.style('font-weight', 'bold'); // Font weight
					} else {
						svg
							.selectAll('.x-axis .tick text')
							.style('fill', '#ffffff') // White label color
							.style('font-size', '12px') // Font size
							.style('font-weight', 'bold'); // Font weight
					}
				}
			});

			if (callback) callback();
		}
	}, [
		data,
		containerWidth,
		brickHeight,
		latlng,
		margin.left,
		margin.right,
		margin.top,
		brickBackgroundColor,
		chartFillOpacity,
		chartStrokeOpacity,
		colorMode,
		chartBorderColors,
	]);

	useEffect(() => {
		// Initialize fitbounds once
		setIsMapInitialized(true);

		// Run fitbounds on command
		if (shouldFitBounds) {
			setShouldFitBounds(false); // Reset the flag
		}
	}, [shouldFitBounds]);

	const keys = Object.keys(data).filter((key) => key !== 'Distance');
	const boxHeight = brickHeight * keys.length + (margin.top + 1);

	return (
		<>
			<AnalysisMap
				positions={latlng}
				highlightInterval={highlightInterval}
				isMapInitialized={isMapInitialized}
				toggleFitBounds={shouldFitBounds}
				fitBoundsType={boundsType}
				mouseIndex={mouseIndex}
			/>
			<Flex direction="row" w="100%" h="100%" p={0} borderTop={`1px solid ${chartBorderColors}`}>
				<Flex direction="column" align="flex-start">
					<Box w="120px" h={`${margin.top}px`} backgroundColor={topAxisBarColor} zIndex={0}></Box>
					{keys.map((key) => (
						<Box key={key}>
							<Flex direction={'row'}>
								{/* UI for the information boxes on the left of the plots */}
								<Box
									key={key}
									w="80px"
									h={brickHeight + 2}
									backgroundColor={statBackgroundColor}
									borderBottom={colorMode == 'light' ? '2px solid #ffffff' : '2px solid #000000'}
								>
									<Stat>
										<Flex direction={'column'} height={brickHeight + 2} justify={'center'} align={'center'}>
											<StatLabel fontSize={'lg'} fontWeight={'normal'}>
												{key}
											</StatLabel>
											<StatHelpText fontSize={'xs'}>
												{/* Sends the true max for everything, sends the min for pace */}
												Max{' '}
												{key === 'Pace'
													? formatStatNumber(key, intervalData[key]?.min)
													: formatStatNumber(key, intervalData[key]?.max)}
												<Spacer />
												Avg {formatStatNumber(key, intervalData[key]?.avg)}
											</StatHelpText>
										</Flex>
									</Stat>
								</Box>
								<Flex
									direction={'column'}
									justify={'space-between'}
									w={'40px'}
									h={brickHeight + 2}
									borderBottom={`2px solid ${chartBorderColors}`}
									align={'center'}
									backgroundColor={cursorStatBackgroundColor}
								>
									<Stat>
										<Flex direction={'column'} justify={'start'} height={`${brickHeight / 3.3}px`}>
											<StatNumber fontSize="sm" fontWeight="light" color={'#999'} alignSelf={'center'}>
												{formatStatNumber(key, intervalData[key]?.max)}
											</StatNumber>
										</Flex>
									</Stat>
									<Stat>
										<Flex direction={'column'} justify={'bottom'} height={`${brickHeight / 3.3}px`}>
											<StatNumber
												fontSize="md"
												fontWeight="bold"
												color={colorMode == 'light' ? data[key].color : '#fff'}
												alignSelf={'center'}
											>
												{formatStatNumber(key, hoverData[key])}
											</StatNumber>
											<StatHelpText fontSize={'11px'} fontWeight="light" color={'#999'} alignSelf={'center'}>
												{data[key].unit}
											</StatHelpText>
										</Flex>
									</Stat>
									<Stat>
										<Flex direction={'column'} justify={'end'} height={`${brickHeight / 3}px`}>
											<StatNumber fontSize="sm" fontWeight="light" color={'#999'} alignSelf={'center'}>
												{formatStatNumber(key, intervalData[key]?.min)}
											</StatNumber>
										</Flex>
									</Stat>
								</Flex>
							</Flex>
						</Box>
					))}
				</Flex>

				<Box flex="1" h={boxHeight + (Object.keys(data).length - 1.5) * 2} w={'100%'} backgroundColor={topAxisBarColor}>
					<div ref={containerRef} style={{ width: '100%', height: '100%' }}>
						<svg
							ref={chartRef}
							width={'100%'}
							height={brickHeight * Object.keys(data).length + margin.top + margin.bottom}
							style={{ width: '100%', height: '100%' }} // Main SVG overflow remains default
						>
							{/* D3 chart elements */}
						</svg>
					</div>
				</Box>
			</Flex>
		</>
	);
};

export default AnalysisComponent;
