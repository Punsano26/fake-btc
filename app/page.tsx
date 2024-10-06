"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Stack,
  Container,
  Card,
  CardContent,
  TextField,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ethers } from "ethers";
import { formatEther, parseUnits } from "@ethersproject/units";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
// นำเข้า ABI
import abi from "./abi.json";


const [metaMask, hooks] = initializeConnector(
  (actions) => new MetaMask({ actions })
);
const { useAccounts, useIsActive, useProvider } = hooks;
const contractChain = 11155111;
const contractAddress = "0x8544426Bb8d47C1884eB326a328A854C79ADBF4d";

const getAddressTxt = (str: string, s = 6, e = 6) => {
  if (str) {
    return `${str.slice(0, s)}...${str.slice(str.length - e)}`;
  }
  return "";
};

export default function Page() {
  const accounts: any = useAccounts();
  const isActive: any = useIsActive();
  const provider: any = useProvider();

  const [balance, setBalance] = useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      const signer: any = provider?.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const myBalance = await smartContract.balanceOf(accounts[0]);
      setBalance(formatEther(myBalance));
    };
    if (isActive) {
      fetchBalance();
    }
  }, [isActive]);

  const [ETHValue, setETHValue] = useState(0);
  const handleBuy = async () => {
    if (ETHValue <= 0) {
      return;
    }

    const signer = provider?.getSigner();
    const smartContract = new ethers.Contract(contractAddress, abi, signer);
    const weiValue = parseUnits(ETHValue.toString(), "ether");
    const tx = await smartContract.buy({
      value: weiValue.toString(),
    });
    console.log("Transaction hash:", tx.hash);
  };

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
    alert(
      "To fully disconnect, please remove this site from MetaMask's connected sites by locking metamask."
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images8.alphacoders.com/123/thumb-1920-1239331.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#ff005a", // สีพื้นหลังสดใส
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // เงาให้ชัดเจน
            borderBottom: "3px solid #ffcc00", // เส้นขอบด้านล่าง
          }}
        >
          <Toolbar
            sx={{
              border: "2px solid #ffcc00", // เพิ่มเส้นขอบ
              borderRadius: "8px", // มุมโค้ง
              padding: "8px", // เพิ่มพื้นที่ภายใน
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: "#fff", // เปลี่ยนสีข้อความเป็นสีขาว
                fontWeight: "bold", // ข้อความหนา
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // เงาข้อความ
              }}
            >
              Fake BTC
            </Typography>

            {!isActive ? (
              <Button
                variant="contained"
                onClick={handleConnect}
                sx={{
                  backgroundColor: "#ffcc00", // สีปุ่มสดใส
                  color: "#000", // ข้อความสีดำ
                  "&:hover": {
                    backgroundColor: "#ffa500", // สีปุ่มเมื่อ hover
                  },
                  borderRadius: "10px", // มุมปุ่มโค้ง
                  padding: "8px 16px", // ขนาดปุ่มใหญ่ขึ้น
                }}
              >
                Connect
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Chip
                  label={getAddressTxt(accounts[0])}
                  variant="outlined"
                  sx={{
                    borderColor: "#ffcc00", // สีขอบของ Chip
                    color: "#fff", // สีข้อความ
                    fontWeight: "bold",
                  }}
                />
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleDisconnect}
                  sx={{
                    backgroundColor: "#ffcc00",
                    "&:hover": {
                      backgroundColor: "#ffa500",
                    },
                    color: "#000",
                    borderRadius: "10px",
                    padding: "8px 16px",
                  }}
                >
                  Disconnect
                </Button>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          mt: 2,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 4,
          padding: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {isActive ? (
          <>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent
                sx={{
                  padding: 4,
                  textAlign: "center",
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h4" color="primary">
                    FBTC Wallet
                  </Typography>
                  <TextField
                    label="Wallet Address"
                    value={contractAddress}
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: "#f0f0f0", borderRadius: 2 }}
                  />
                  <TextField
                    label="Balance"
                    value={balance}
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: "#f0f0f0", borderRadius: 2 }}
                  />
                  <Divider />
                  <Typography variant="h5" color="secondary">
                    Buy FBTC
                  </Typography>
                  <TextField
                    label="ETH"
                    type="number"
                    fullWidth
                    onChange={(e: any) => setETHValue(e.target.value)}
                    variant="outlined"
                    sx={{ backgroundColor: "#f0f0f0", borderRadius: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleBuy}
                    sx={{
                      backgroundColor: "#800080",
                      "&:hover": {
                        backgroundColor: "#5a005a",
                      },
                      borderRadius: 2,
                      padding: "12px 20px",
                      fontSize: "1.1rem",
                    }}
                  >
                    Buy Now
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </>
        ) : null}
      </Container>
    </div>
  );
}
