export interface Item {
    pad: { location: { country_code?: string; total_launch_count?: number } };
  }
 export interface Store {
    launchData: any;
    getLaunchData: () => void;
   
  }
  