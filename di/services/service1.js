module.exports = (service2) => {
    return {
        runService() {
            console.log("Service 1 is running");
            service2.runService();
        }
    }
}