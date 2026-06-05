import { Contract, getAddress, isAddress } from "ethers";
import factoryArtifact from "./generated/ApprovalMatrixFactory.json";

const deploymentUrl = `${import.meta.env.BASE_URL}deployments/bsc-mainnet.json`;

export async function loadDeployment(provider) {
  const response = await fetch(deploymentUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("无法读取 BSC 部署配置");

  const deployment = await response.json();
  const factoryFromQuery = new URLSearchParams(window.location.search).get("factory");
  const factoryAddress = factoryFromQuery || deployment.factoryAddress;

  if (deployment.targets?.length > 0) {
    return {
      ...deployment,
      factoryAddress,
      targets: deployment.targets.map(getAddress)
    };
  }

  if (factoryAddress && isAddress(factoryAddress) && provider) {
    const factory = new Contract(getAddress(factoryAddress), factoryArtifact.abi, provider);
    const targets = await factory.getTargets();
    return {
      ...deployment,
      factoryAddress: getAddress(factoryAddress),
      targets: targets.map(getAddress)
    };
  }

  return {
    ...deployment,
    factoryAddress,
    targets: []
  };
}
