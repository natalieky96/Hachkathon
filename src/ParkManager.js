// import User from "User.js";
// import ParkingSpot from "ParkingSpot";

let ID_cnt = 0;
const DAYS_FOR_RESERVATION = 1;
const TIME_SLOTS_IN_A_DAY = 24*4;

/**
 * Class of the customer of the app
 */
export class User {
    _ID;
    _username;
    _home_address;
    _email_address;
    _phone_number;
    _car_numbers;
    _credit_card;
    _reservations;
    _owner_of_parkingSlotsID;
    constructor(ID, username, home_address, email_address, phone_number, car_numbers, credit_card) {
        this.check_data(username, home_address, email_address, phone_number, car_numbers, credit_card);
        this._ID = ID;
        this._username = username;
        this._home_address = home_address;
        this._email_address = email_address;
        this._phone_number = phone_number;
        this._car_numbers = car_numbers;
        this._credit_card = credit_card;
        this._reservations = new Set();
        this._owner_of_parkingSlotsID = new Set();
    }

        /**
         * Check the validity of the inputted data
         * @param username
         * @param home_address
         * @param email_address
         * @param phone_number
         * @param car_numbers
         * @param credit_card
         */
    check_data(username, home_address, email_address, phone_number, car_numbers, credit_card){
        return true;
    }

    addReservation(parkingSpotID, day, beginTime, endTime){
        this._reservations.add([parkingSpotID, day, beginTime, endTime]);
    }

    cancelReservation(parkingSpotID, day, beginTime, endTime){
        if (this._reservations.has([parkingSpotID, day, beginTime, endTime])) {
            this._reservations.remove([parkingSpotID, day, beginTime, endTime]);
        }
    }

    addOwnParkingSpotID(parkingSpotID){
        this._owner_of_parkingSlotsID.add(parkingSpotID);
    }

    removeOwnParkingSpotID(parkingSpotID){
        this._owner_of_parkingSlotsID.remove(parkingSpotID);
    }

    getID(){
        return this._ID;
    }


}


/**
 * Class of the Parking Spot.
 */
export class ParkingSpot {
    _ID;
    _ownerID;
    _address;
    _price;
    _timeSlots;

    constructor(ID, ownerID, address, price) {
        this._ID = ID;
        this._ownerID = ownerID;
        this._address = address;
        this._price = price;
        this._timeSlots = this._createTimeSlots();
    }

    getID(){
        return this._ID;
    }

    getTimeSlots(){
        return this._timeSlots;
    }

    getOwnerID(){
        return this._ownerID;
    }

    _createTimeSlots(){
        let arr = new Array(DAYS_FOR_RESERVATION);
        for(let i = 0; i<DAYS_FOR_RESERVATION; i++) {
            arr[i] = new Array(TIME_SLOTS_IN_A_DAY);
            arr[i].fill(null);
        }
        return arr;
    }

    printTimeSlots(){
        console.log(this._timeSlots);
    }

    /**
     * Checks if the time slots are available
     * @param day
     * @param timeBegin
     * @param timeEnd
     * @returns {boolean}
     */
    isTimeSlotEmpty(day, timeBegin, timeEnd){
        for (let time = timeBegin; time < timeEnd; time++){
            if (this._timeSlots[day][time] != null){
                return false;
            }
        }
        return true;
    }


    /**
     * Adds a reservation in a given time
     * @param userID
     * @param day
     * @param timeBegin
     * @param timeEnd
     */
    addReservation(userID, day, timeBegin, timeEnd) {
        if (this.isTimeSlotEmpty(day, timeBegin, timeEnd)){
            for (let time = timeBegin; time < timeEnd; time++){
                this._timeSlots[day][time] = userID;
            }
        } else {
            return -1;
        }
    }


    cancelReservation(userID, day, timeBegin, timeEnd) {
        for (let time = timeBegin; time < timeEnd; time++) {
            if (this._timeSlots[day][time] === userID) {
                this._timeSlots[day][time] = null;
            } else {
                throw Error("userID doesn't match reservation");
            }
        }
    }

}

export class ParkManager{
    _parkingSpots_list;
    _users_list;

    constructor() {
        this._parkingSpots_list = [];
        this._users_list = [];
    }

    addUser(username, home_address, email_address, phone_number, car_numbers, credit_card){
        let userID = ID_cnt;
        ID_cnt++;
        let user = new User(userID, username, home_address, email_address, phone_number, car_numbers, credit_card);
        this._users_list.push(user);
        return userID;
    }

    addParkingSpot(ownerID, address, price){
        let parkingSpotID = ID_cnt;
        ID_cnt++;
        let parkingSpot = new ParkingSpot(parkingSpotID, ownerID, address, price);
        this._parkingSpots_list.push(parkingSpot);
        let owner = this.getUserByID(ownerID);
        owner.addOwnParkingSpotID(parkingSpotID);
        return parkingSpotID;
    }

    removeParkSpot(parkSpotID){
        let parkSpot = this.getParkingSlotByID(parkSpotID);
        let owner = parkSpot.getOwnerID();
        this._parkingSpots_list.remove(parkSpot);
        owner.removeOwnParkingSpotID(parkSpotID);
    }

    removeUser(userID){
        let user = this.getUserByID(userID);
        this._users_list.remove(user);
    }

    getAvailableSpots(day, beginTime, endTime){
        let availableSpots = [];
        let beginTimeIndex = this.timeToIndex(beginTime);
        let endTimeIndex = this.timeToIndex(endTime);
        for (let i=0; i < this._parkingSpots_list.length; i++){
            if (this._parkingSpots_list[i].isTimeSlotEmpty(day, beginTimeIndex, endTimeIndex)) {
                availableSpots.push(this._parkingSpots_list[i].getID())
            }
        }
        return availableSpots;
    }

    getParkingSlotByID(ID){
        for (let i=0; i < this._parkingSpots_list.length; i++){
            if (this._parkingSpots_list[i].getID() === ID) {
                return this._parkingSpots_list[i];
            }
        } throw Error("The parkingSlot ID doesn't exist");
    }

    getUserByID(ID){
        for (let i=0; i < this._users_list.length; i++){
            if (this._users_list[i].getID() === ID) {
                return this._users_list[i];
            }
        } throw Error("The user ID doesn't exist");
    }

    reservePark(userID, parkingSpotID, day, beginTime, endTime) {
        let beginTimeIndex = this.timeToIndex(beginTime);
        let endTimeIndex = this.timeToIndex(endTime);
        let user = this.getUserByID(userID);
        user.addReservation(parkingSpotID, day, beginTimeIndex, endTimeIndex);
        let parkingSlot = this.getParkingSlotByID(parkingSpotID);
        parkingSlot.addReservation(userID, day, beginTimeIndex, endTimeIndex);
        // parkingSlot.printTimeSlots()
    }

    cancelReservation(userID, parkingSpotID, day, beginTime, endTime){
        let beginTimeIndex = this.timeToIndex(beginTime);
        let endTimeIndex = this.timeToIndex(endTime);
        let user = this.getUserByID(userID);
        user.cancelReservation(parkingSpotID, day, beginTimeIndex, endTimeIndex);
        let parkingSlot = this.getParkingSlotByID(parkingSpotID);
        parkingSlot.cancelReservation(userID, day, beginTimeIndex, endTimeIndex);
    }

    getParkingSpotInfo(parkingSpotID){
        let parkingSlot = this.getParkingSlotByID(parkingSpotID);
        return parkingSlot.getTimeSlots();
    }

    printUsers(){
        console.log(this._users_list);
    }

    printParkingSlots(){
        for (let i=0; i < this._parkingSpots_list.length; i++) {
            console.log("ParkingSpotID:" + this._parkingSpots_list[i].getID());
            this._parkingSpots_list[i].printTimeSlots();
        }
    }

    timeToIndex(time){
        // console.log(time);
        let value = Math.floor(time)*4 + ((time - Math.floor(time))% 0.15);
        // console.log(value);
        return value;
    }

    indexToTime(index){
        // console.log("index: ")
        // console.log(index)
        let value = Math.floor((index/4) + (index % 4) * 0.15);
        // console.log("time: ")
        // console.log(value);
        return value;
    }

}

// function main(){
    // let parkManager = new ParkManager();
    // let id0 = parkManager.addUser("daya matok gawi", "bezalel 28", "dada222@gmail.com", "0546700587", "1247468473", "1863773363");
    // parkManager.printUsers();
    // let idP = parkManager.addParkingSpot(id0, "bezalel 28", "18");
    // let spot = parkManager.getParkingSlotByID(idP);
    // spot.printTimeSlots();
    // parkManager.addParkingSpot(id0, "bezalel 68", "18");
    // let id2 = parkManager.addUser("gaga ko", "haha 28", "bkoh222@gmail.com", "0546700587", "1247468473", "1863773363");
    // parkManager.reservePark(id2,idP, 0, 1.00,4.00 );
    // parkManager.printParkingSlots();
    // parkManager.cancelReservation(id2,idP, 0, 4,8 );
    // parkManager.printParkingSlots();
// }

// main()