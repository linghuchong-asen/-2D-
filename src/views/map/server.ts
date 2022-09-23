import { http } from "@/utils/http";

export interface AlarmArea {
  alarmarea_group: null;
  bypass_end: null | string;
  bypass_start: null | string;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  dev: string;
  devgroup: string[];
  devgroupobj: string[];
  devname: string;
  devtype: number;
  event_flag: number;
  func_state: number;
  height: number;
  id: number;
  intervaltime: number;
  is_bypass: boolean;
  is_cover: boolean;
  is_delete: boolean;
  is_failure: boolean;
  is_multitype: boolean;
  is_working: boolean;
  level: number;
  linkarea: null;
  linkcamera: string[];
  linktype: number;
  logictype: number;
  name: string;
  no: null;
  planned: null;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: string[];
  type: number;
}

export interface Shape {
  coordinates: Array<Array<number[]>>;
  type: string;
}
// 获取防区
export const getAlarmArea = () =>
  http<AlarmArea[] | { detail: string }>("/API/V0.1/Area/AlarmArea/");

export interface ElementProject {
  cameraprojection: null | Cameraprojection;
  datasource: string;
  elementtype: string;
  id: number;
  level: number;
  maxvisibledis: number;
  memo: string;
  minivisibledis: number;
  name: string;
  parent: null;
  property: Property;
  property_id: number | null;
  propertytype: number;
  region: number;
  sectioning: null;
  style: string;
  viewpoint: null | ApifoxModalViewpoint;
  visible: boolean;
}

export interface Cameraprojection {
  camcode: string;
  element: number;
  eye: Eye;
  foc: Foc;
  geometry: CameraprojectionGeometry;
  hvdx: number;
  hvdy: number;
  hvdz: number;
  id: number;
  linevisible: number;
  memo: string;
  name: string;
  projectorvisible: number;
  region: number;
  scenevisible: number;
  updirectionx: number;
  updirectiony: number;
  updirectionz: number;
}

export interface Eye {
  coordinates: number[];
  type: string;
}

export interface Foc {
  coordinates: number[];
  type: string;
}

export interface CameraprojectionGeometry {
  coordinates: number[];
  type: string;
}

export interface Property {
  aug_rng: number | null;
  azi: number;
  camera_pwd?: string;
  camera_uname?: string;
  closing_time?: number;
  create_time?: string;
  creationtime?: string;
  describe?: string;
  dis_rng: number;
  element: number;
  factory?: string;
  from_service?: null;
  geometry: PropertyGeometry;
  height?: number;
  horizonscope?: number;
  id: number;
  io?: number;
  ip: string;
  is_alarming?: boolean;
  is_delete: boolean;
  is_output?: boolean;
  lat?: number;
  lon?: number;
  max_pan?: number;
  max_tilt?: number;
  max_zoom?: number;
  memo?: string;
  min_tilt?: number;
  name: string;
  north_angle?: number;
  offset_pan?: number;
  offset_tilt?: number;
  opening_duration?: number;
  opening_time?: number;
  person_phone?: string;
  person_uname?: string;
  port: number | string;
  position_msg?: string;
  positionmsg?: string;
  r_id?: string;
  region: number;
  region_name?: string;
  state: null | string;
  time?: string;
  timestamp?: string;
  type?: number | string;
  viewpoint?: PropertyViewpoint;
  vm_name?: string;
  vm_no?: string;
}

export interface PropertyGeometry {
  coordinates: number[];
  type: string;
}

export interface PropertyViewpoint {
  coordinates: number[];
  type: string;
}

export interface ApifoxModalViewpoint {
  distance: number;
  element: number;
  geometry: ViewpointGeometry;
  heading: number;
  id: number;
  memo: string;
  name: string;
  pitch: number;
  region: number;
  type: number;
}

export interface ViewpointGeometry {
  coordinates: number[];
  type: string;
}

// 资源列表
export const elementProject = () =>
  http<ElementProject[] | { detail: string }>(
    "/API/V0.1/JMSceneConfigService/ElementProject/",
    { params: { level: 2 } }
  );
