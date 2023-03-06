class AppConfig {
    public port = 3001;
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    public mysqlDatabase = "Vacations" // Must fill in...
}

const appConfig = new AppConfig();

export default appConfig;