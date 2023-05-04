import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";

export class RoleManagerController {
  ethersProvider: EthersProvider;
  roleManagerContract: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
  }

  async init() {
    this.roleManagerContract = await this.ethersProvider.getRoleManagerContract();
    // Add any necessary event listeners or subscriptions here
    console.log("roleManagerContract: ", this.roleManagerContract);
  }

  async grantRoleToSeller(address: string) {
    console.log("Calling grantRoleToSeller", `address: ${address}`);
    try {
        const result = this.ethersProvider.getRoleManagerContract;
      console.log("Grant role to seller result: ", result);
      return result;
    } catch (error) {
      console.error("Error granting role to seller: ", error);
      throw error;
    }
  }

    async revokeRoleFromSeller(address: string) {
        console.log("Calling revokeRoleFromSeller", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.revokeRoleFromSeller(address);
            console.log("Revoke role from seller result: ", result);
            return result;
        } catch (error) {
            console.error("Error revoking role from seller: ", error);
            throw error;
        }
    }

    async grantRoleToVeterinarian(address: string) {
        console.log("Calling grantRoleToVeterinarian", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.grantRoleToVeterinarian(address);
            console.log("Grant role to veterinarian result: ", result);
            return result;
        } catch (error) {
            console.error("Error granting role to veterinarian: ", error);
            throw error;
        }
    }

    async revokeRoleFromBuyer(address: string) {
        console.log("Calling revokeRoleFromBuyer", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.revokeRoleFromBuyer(address);
            console.log("Revoke role from buyer result: ", result);
            return result;
        } catch (error) {
            console.error("Error revoking role from buyer: ", error);
            throw error;
        }
    }

    async grantRoleToDAO(address: string) {
        console.log("Calling grantRoleToDAO", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.grantRoleToDAO(address);
            console.log("Grant role to DAO result: ", result);
            return result;
        } catch (error) {
            console.error("Error granting role to DAO: ", error);
            throw error;
        }
    }

    async revokeRoleFromDAO(address: string) {
        console.log("Calling revokeRoleFromDAO", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.revokeRoleFromDAO(address);
            console.log("Revoke role from DAO result: ", result);
            return result;
        } catch (error) {
            console.error("Error revoking role from DAO: ", error);
            throw error;
        }
    }

    async grantRoleToDefaultAdmin(address: string) {
        console.log("Calling grantRoleToDefaultAdmin", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.grantRoleToDefaultAdmin(address);
            console.log("Grant role to default admin result: ", result);
            return result;
        } catch (error) {
            console.error("Error granting role to default admin: ", error);
            throw error;
        }
    }

    async revokeRoleFromDefaultAdmin(address: string) {
        console.log("Calling revokeRoleFromDefaultAdmin", `address: ${address}`);
        try {
            const result = await this.roleManagerContract.revokeRoleFromDefaultAdmin(address);
            console.log("Revoke role from default admin result: ", result);
            return result;
        } catch (error) {
            console.error("Error revoking role from default admin: ", error);
            throw error;
        }
    }
}