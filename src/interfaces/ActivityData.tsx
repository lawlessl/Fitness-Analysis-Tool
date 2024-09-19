// ActivityData.tsx
// Interfaces used in parsing a FIT file activity
import { Timestamp } from '@firebase/firestore';

export interface ActivityInterface {
	id: string;
	fileName: string;
	baseFileName: string;
	fileType: string;
	parsedData: ParsedData;
	uploadedAt: Timestamp;
}

export interface ParsedData {
	activity: Activity;
	device_settings: DeviceSettings;
	file_creator: FileCreator;
	profile_version: number;
	protocol_version: number;
	user_profile: UserProfile;
	zones_target: ZonesTarget;
}

export interface Activity {
	device_infos: Array<DeviceInfos>;
	event: string;
	event_type: string;
	events: Array<Events>;
	hrv: Array<object>;
	local_timestamp: Timestamp;
	num_sessions: number;
	sessions: Array<Sessions>;
	sports: Array<Sports>;
	timestamp: Timestamp;
	total_timer_time: number;
	type: string;
}

interface DeviceSettings {
	active_time_zone: number;
	time_offset: number;
	time_zone_offset: number;
	utc_offset: number;
}

interface FileCreator {
	softwareVersion: number;
}

interface UserProfile {
	activity_class: object;
	age: number;
	default_max_biking_heart_rate: number;
	default_max_heart_rate: number;
	dist_setting: string;
	elev_setting: string;
	friendly_name: string;
	gender: string;
	height_setting: string;
	height: number;
	hr_setting: string;
	language: string;
	position_setting: string;
	power_setting: string;
	resting_heart_rate: number;
	speed_setting: string;
	temperature_setting: string;
	weight_setting: string;
	weight: number;
}

interface ZonesTarget {
	functional_threshold_power: number;
	hr_calc_type: string;
	pwr_calc_type: string;
	threshold_heart_rate: number;
}

interface Sports {
	name: string;
	sport: string;
	sub_sport: string;
}

export interface Sessions {
	avg_cadence: number;
	avg_fractional_cadence: number;
	avg_heart_rate: number;
	avg_power: number;
	avg_speed: number;
	avg_temperature: number;
	avg_vam: number;
	event_type: string;
	event: string;
	first_lap_index: number;
	intensity_factor: number;
	laps: Array<Laps>;
	left_right_balance: LeftRightBalance;
	max_cadence: number;
	max_fractional_cadence: number;
	max_heart_rate: number;
	max_power: number;
	max_speed: number;
	max_temperature: number;
	message_index: object;
	nec_lat: number;
	nec_long: number;
	normalized_power: number;
	num_laps: number;
	sport: string;
	start_position_lat: number;
	start_position_long: number;
	start_time: object;
	sub_sport: string;
	swc_lat: number;
	swc_long: number;
	threshold_power: number;
	timestamp: object;
	total_anaerobic_effect: number;
	total_ascent: number;
	total_calories: number;
	total_cycles: number;
	total_descent: number;
	total_distance: number;
	total_elapsed_time: number;
	total_timer_time: number;
	total_training_effect: number;
	total_work: number;
	training_stress_score: number;
	trigger: string;
}

export interface Laps {
	avg_cadence: number;
	avg_fractional_cadence: number;
	avg_heart_rate: number;
	avg_power: number;
	avg_speed: number;
	avg_temperature: number;
	avg_vam: number;
	end_position_lat: number;
	end_position_long: number;
	event: string;
	event_type: string;
	intensity: object;
	lap_trigger: string;
	left_right_balance: object;
	lengths: undefined;
	max_cadence: number;
	max_fractional_cadence: number;
	max_heart_rate: number;
	max_power: number;
	max_speed: number;
	max_temperature: number;
	message_index: object; // complete this if needed
	normalized_power: number;
	records: Array<Records>;
	sport: string;
	start_position_lat: number;
	start_position_long: number;
	start_time: string;
	sub_sport: string;
	timestamp: string;
	total_ascent: number;
	total_calories: number;
	total_cycles: number;
	total_descent: number;
	total_distance: number;
	total_elapsed_time: number;
	total_timer_time: number;
	total_work: number;
	wkt_step_index: object; // complete this if needed
}

export interface Records {
	accumulated_power: number;
	altitude: number;
	cadence: number;
	distance: number;
	elapsed_time: number;
	fractional_cadence: number;
	heart_rate: number;
	position_lat: number;
	position_long: number;
	power: number;
	speed: number;
	temperature: number;
	timer_time: number;
	timestamp: string;
}

interface Events {
	data: number;
	event_group?: number;
	event_type: string;
	event: string;
	timestamp: string;
}

interface DeviceInfos {
	ant_network?: string;
	battery_status?: string;
	battery_voltage?: number;
	cum_operating_time?: number;
	device_index: number;
	device_type?: number | string;
	hardware_version?: number;
	manufacturer?: string;
	product?: number;
	serial_number?: number;
	software_version?: number;
	source_type: string;
	timestamp: object;
}

interface LeftRightBalance {
	0: boolean;
	right: boolean;
	value: number;
}
