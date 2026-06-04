import fs from "node:fs";
import path from "node:path";
import solc from "solc";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "contracts", "ApprovalMatrixFactory.sol");
const outputPath = path.join(root, "src", "generated", "ApprovalMatrixFactory.json");
const source = fs.readFileSync(sourcePath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ApprovalMatrixFactory.sol": { content: source }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = (output.errors ?? []).filter((entry) => entry.severity === "error");

if (errors.length > 0) {
  console.error(errors.map((entry) => entry.formattedMessage).join("\n"));
  process.exit(1);
}

const contract = output.contracts["ApprovalMatrixFactory.sol"].ApprovalMatrixFactory;
const artifact = {
  contractName: "ApprovalMatrixFactory",
  abi: contract.abi,
  bytecode: `0x${contract.evm.bytecode.object}`,
  deployedBytecode: `0x${contract.evm.deployedBytecode.object}`,
  compiler: solc.version()
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`Compiled ApprovalMatrixFactory with ${artifact.compiler}`);

