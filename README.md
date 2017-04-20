# LXC DEMO

## Installation
1. Use [this link]() to set up LXC containers.
2. SSH into LXC container 1 (10.0.3.11) before continuing:

	To install Redis Server,
	
	`sudo apt-get install redis-server`
	
	Then you will need to allow port 6379 used by Redis in the firewall. 
	
	`sudo iptables -A INPUT -p tcp --dport 6379 -j ACCEPT`
	
	Now install node, git & npm using this command,
	
	`sudo apt-get install node` (Ubuntu 14.0.4) or `sudo apt-get install nodejs` (Ubuntu 16.0.4)
	
	`sudo apt-get install npm` (if required)
	
	`sudo apt-get install git`
	
	Then git clone this repository and run `npm install` to install all dependencies.
	
	Now run the load balancer using `node lxc_main.js`. 

3. SSH into LXC container 3 (10.0.3.12) and then,

	 Now install node, git & npm using this command,
	
	`sudo apt-get install node` (Ubuntu 14.0.4) or `sudo apt-get install nodejs` (Ubuntu 16.0.4)
	
	`sudo apt-get install npm` (if required)
	
	`sudo apt-get install git`
	
	Then git clone this repository and run `npm install` to install all dependencies.
	
	Now run the simple server using `node lxc_container.js`. 

4. SSH into LXC container 2 (10.0.3.13) and then,

	 Now install node, git & npm using this command,
	
	`sudo apt-get install node` (Ubuntu 14.0.4) or `sudo apt-get install nodejs` (Ubuntu 16.0.4)
	
	`sudo apt-get install npm` (if required)
	
	`sudo apt-get install git`
	
	Then git clone this repository and run `npm install` to install all dependencies.
	
	Now run the simple server using `node lxc_container.js`. 

**Note**: You can change the predefined output in `lxc_container.js` as needed, to differentiate between Containers 2 and 3.