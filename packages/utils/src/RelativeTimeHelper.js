class RelativeTime {

    constructor(dateFrom, dateTo) {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.timeDiff = Math.abs(dateTo.getTime() - dateFrom.getTime());
    }

    differenceInSec = () =>{
        this.seconds = Math.round(this.timeDiff / 1000);
        return this.seconds > 0 && this.seconds <= 60 ? this.seconds : false;
    };

    differenceInMins = () =>{
        this.minutes = Math.round(this.timeDiff / (1000 * 60));
        return this.minutes > 0 && this.minutes <= 60 ? this.minutes : false;
    };

    differenceInHours = () =>{
        this.hours = Math.round(this.timeDiff / (1000 * 3600));
        return this.hours > 0 && this.hours <= 24 ? this.hours : false;
    };

    differenceInDays = () => {
        this.days = Math.round(this.timeDiff / (1000 * 3600 * 24));
        return this.days > 0 && this.days <= 31 ? this.days : false;
    };

    differenceInMonths = () => {
        this.month =  this.dateTo.getMonth() - this.dateFrom.getMonth() +
            (12 * (this.dateTo.getFullYear() - this.dateFrom.getFullYear()));

        return this.month > 0 && this.month <= 12 ? this.month : false;
    };

    differenceInYears = () =>{
        this.year = new Date(this.dateTo - this.dateFrom).getFullYear() - 1970;
        return this.year > 0 ? this.year : false;
    }

    getDateDifference() {
        if (this.differenceInSec()) {
            return { relativeTime: 'Just Now', inSeconds: this.seconds };
        }
        else if (this.differenceInMins()) {
            return { relativeTime: this.minutes + ' minutes ago', inMinuts: this.minutes };
        }
        else if (this.differenceInHours()) {
            return { relativeTime: this.hours + ' hours ago', inHours: this.hours };
        }
        else if (this.differenceInDays()) {
            return { relativeTime: (this.days === 1 ? 'Yesterday' : this.days + ' days ago'), inDays: this.days };
        }
        else if (this.differenceInMonths()) {
            return { relativeTime: this.month + ' month ago', inMonths: this.month };
        }
        else if (this.differenceInYears()) {
            return { relativeTime: this.year + ' year ago', inYears: this.year };
        } else {
            return { relativeTime: this.dateFrom, defaultCase: true };
        }
    }
}

export default RelativeTime;
