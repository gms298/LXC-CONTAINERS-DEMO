# CSC 519 - DevOps TechTalks - LXC Containers
## Developers

Name  | Unity ID
------------- | -------------
Manoj Sharan Gunasegaran  | mgunase
Nivedita Natarajan  | nnatara2
Pawash Ahuja | pahuja2

## INDEX

1. [Linux Containers](#lxc)
2. [Container in Bridged Mode](#bm)
3. [Container Attached to an OVS Bridge](#ovs)
4. [Network Configuration](#nc)
5. [Demo-App](#app)
6. [Demo-App Screencast](#scr)

## <a name="lxc"></a>Linux Containers


1. Install bridge-utils package.

	```
	sudo apt-get install bridge-utils
	```

2. Install the lxc package.

	```
	sudo apt-get install lxc
	```
	
	This command creates a lxcbr0 bridge. To verify this, we can run the command:
	```
	 brctl show 
	```

3. Creating a containe(priviliged).

	```
	sudo lxc­-create –t ubuntu –n container1 ­­ ­r precise 
	```

	This command creates the container, container1. The network mode by default is NAT. A veth interface will be created on the lxcbr0 bridge for the container. To verify this, we can run the command:
	```
	sudo lxc-­ls ­­--fancy 
	```
	
	To get more information about the container, use the command:

	```
 	sudo lxc--­info –n container1
	```

4. Start the container.

	```
	sudo lxc-­start –n container1 –d 	
	```

	To verify this, we can run the command:
	```
	sudo lxc-­ls --­­fancy 
	```
	
	The veth interface is attached to the bridge after the container is started.
	This can be verified using the command: 
	```
	brctl show 
	```

5. In order to enter the container, use the command: 
 	
	```
	sudo lxc­-attach –n container1
	```

6. Destroying the container can be done using:
	
	```
	sudo lxc­-destroy -­n container1
	```
	
	This can be verified using the command:
	```
	sudo lxc-­ls ­­--fancy 
	```

## <a name="bm"></a> Creating a Container in Bridged Mode

A bridge can be used so that many containers can be connected to this bridge. This can be done using the brctl commands.

```
sudo brctl addbr br0 
```

In order to verify this, we can use the command: 
```
sudo brctl show
```

## <a name="ovs"></a>Container attached to an OVS Bridge

1) Install the OVS package.

```
sudo apt­-get install openvswitch-­switch
```

This can be verified using the command: 
```
sudo ovs­-vsctl show
```

This command will be able to show the version of OVS since no bridge has been created yet.

2) Creating an OVS Bridge

```
sudo ovs-­vsctl add-­br ovsbr0
```
	
In order to verify this, use the command:
```
sudo ovs-­vsctl show
```

3) Creating the container.

```
sudo lxc-­create –t ubuntu –n C3 ­­ ­r precise
```

	
In order to verify this, use the command:
```
sudo lxc-­ls ­­fancy
```

4) Configuration changes

Open the config file for container C3 which is found at ```/var/lib/lxc/C3/config``` and make the following changes:

* Comment out the lxc.network.link line, which is the configuration parameter that causes the container to attach to lxcbr0 bridge in NAT mode or the linux bridge in bridged mode.
```# lxc.network.link = lxcbr0```
* Next, add a line to run the script after the network interfaces are created. Suppose the script is in ```/etc/lxc directory``` and it is named ```ifup```, add the following line:

```
lxc.network.script.up = /var/lib/lxc/ifup
```

5) Creating the Network Attachment script.

Create a file in ```/var/lib/lxc``` directory named ```ifup```.

```
sudo nano /var/lib/lxc/ifup
```

Add the following lines to the file:

```ini
BRIDGE="ovsbr0"

ovs­-vsctl --­­may-­exist add­-br $BRIDGE

ovs­-vsctl --­­if­-exists del­-port $BRIDGE $5

ovs­-vsctl ­­--may­-exist add­-port $BRIDGE $5
```

Also, we must provide proper permissions to the script so that it can be executed when called while starting the container.

The command to give all permissions to the script:
```
sudo chmod 777 /etc/lxc/ifup
```

6) Start the container.

```
sudo lxc-­start –n C3 –d
```

In order to verify this, use the command:
```
sudo lxc-­ls ­­fancy
```

Now, we can see the veth interfaces created and attached to the OVS bridge.


## <a name="nc"></a>Network Configuration

1) Add the interface ```wlan0``` to OpenvSwitch Bridge ```br-int``` and zero out the eth0 interface.

```ini
sudo ovs-vsctl add-port ovsbr0 eth0

sudo ifconfig eth0

``` 

2) Assign IP to OpenvSwitch Bridge ```ovsbr0```

```
sudo ifconfig ovsbr0 10.0.6.1 netmask 255.255.255.0
```

## <a name="app"></a> Demo 

1. Set up 3 LXC containers using the instructions shown above (including setting IP addresses as shwon below).

2. SSH into LXC container 1 (10.0.3.31) before continuing:

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

3. SSH into LXC container 3 (10.0.3.32) and then,

	 Now install node, git & npm using this command,
	
	`sudo apt-get install node` (Ubuntu 14.0.4) or `sudo apt-get install nodejs` (Ubuntu 16.0.4)
	
	`sudo apt-get install npm` (if required)
	
	`sudo apt-get install git`
	
	Then git clone this repository and run `npm install` to install all dependencies.
	
	Now run the simple server using `node lxc_container.js`. 

4. SSH into LXC container 2 (10.0.3.33) and then,

	 Now install node, git & npm using this command,
	
	`sudo apt-get install node` (Ubuntu 14.0.4) or `sudo apt-get install nodejs` (Ubuntu 16.0.4)
	
	`sudo apt-get install npm` (if required)
	
	`sudo apt-get install git`
	
	Then git clone this repository and run `npm install` to install all dependencies.
	
	Now run the simple server using `node lxc_container.js`. 

**Note**: You can change the predefined output (console.log statement) in `lxc_container.js` as needed, to differentiate between Containers 2 and 3.

## <a name="scr"></a> Screencast

Please [click here](https://youtu.be/KKiphnZOw_8) to watch the screencast.
