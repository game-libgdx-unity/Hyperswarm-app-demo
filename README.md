a simplified P2P auction solution based on Hyperswarm.

With the RPC Client, you should be able to open auctions (e.g. selling a picture for 50 USDt). Upon opening the auction 
your client should notify other parties in ecosystem about the opened auction, that means that every client should 
have also a small RPC Server. Other parties can make a bid on auction by submitting the offer, in this case each bid
should be propagated to all parties in ecosystem. Upon completion of auction the distributed transaction should be 
propagated to all nodes as well.

Sample scenario:
- Client#1 opens auction: sell Pic#1 for 75 USDt
- Client#2 opens auction: sell Pic#2 for 60 USDt
- Client#2 makes bid for Client#1->Pic#1 with 75 USDt
- Client#3 makes bid for Client#1->Pic#1 with 75.5 USDt
- Client#2 makes bid for Client#1->Pic#1 with 80 USDt
- Client#1 closes auction: notifies Client#2, ...Client#..n with information about selling details: Client#2->80 USDt
-

How to run:
Please follow this page https://docs.pears.com/guides/getting-started to install pear in your local

To start the project run: pear dev

https://youtu.be/TdNk5aU52Qs
