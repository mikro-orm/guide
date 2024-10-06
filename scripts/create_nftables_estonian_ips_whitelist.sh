#!/bin/bash

IP_FILE="estonian_ip_ranges.txt"

# Temporary nftables file
NFT_RULES="/etc/nftables_estonian.conf"

# Start the nftables rules configuration
echo "table inet filter {" > $NFT_RULES
echo "    chain input {" >> $NFT_RULES
echo "        type filter hook input priority 0; policy drop;" >> $NFT_RULES
echo "" >> $NFT_RULES

while IFS= read -r line
do
    # Skip lines that don't start with 'allow'
    if [[ $line =~ ^allow\ from\ ([0-9./]+) ]]; then
        # Extract the IP range from the line and add it to the nftables rules
        IP_RANGE="${BASH_REMATCH[1]}"
        echo "        ip saddr $IP_RANGE accept" >> $NFT_RULES
    fi
done < "$IP_FILE"

echo "" >> $NFT_RULES
echo "        # Allow loopback" >> $NFT_RULES
echo "        iif \"lo\" accept" >> $NFT_RULES
echo "        # Allow established connections" >> $NFT_RULES
echo "        ct state established,related accept" >> $NFT_RULES
echo "        # Drop everything else" >> $NFT_RULES
echo "        drop" >> $NFT_RULES
echo "    }" >> $NFT_RULES
echo "}" >> $NFT_RULES

# Load the nftables configuration
nft -f $NFT_RULES
