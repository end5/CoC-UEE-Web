	export class Time 
	{
		private  _days: number;
		private  _hours: number;
		private  _minutes: number;
		
		public  get days(): number { return _days; }
		public  set days(value: number): void { _days = value; }
		
		public  get hours(): number { return _hours; }
		public  set hours(value: number): void { _hours = value; }		
		
		public  get minutes(): number { return _minutes; }
		public  set minutes(value: number): void { _minutes = value; }		
		
		public  get totalTime(): number { return (this._days * 24 + this._hours); }
	}
