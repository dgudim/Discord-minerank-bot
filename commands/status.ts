import { ICommand } from "dkrcommands";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { getServerStatus } from "../utils/status_utils";
import { minecraftServerUrl } from "..";
import { safeReply } from "discord_bots_common/dist/utils/utils";

export default {
    category: "Status",
    description: "Display minecraft server status",

    slash: true,
    testOnly: true,
    ownerOnly: false,
    hidden: false,

    callback: async ({ interaction }) => {

        const status = await getServerStatus();
        if (!status) {
            await safeReply(interaction, "Error getting status", true);
        } else {
            const embed = new EmbedBuilder();
            embed.setTitle(status.motd.clean);
            embed.setDescription(`${status.players.online}/${status.players.max}`);

            embed.setColor("DarkGreen");
            embed.setURL(`https://${minecraftServerUrl}`);
            embed.setAuthor(status.version);

            const base64Data = status.favicon?.replace(/^data:image\/png;base64,/, "");
            if (base64Data) {
                const file = new AttachmentBuilder(Buffer.from(base64Data, "base64"), { name: "favicon.png" });
                embed.setThumbnail("attachment://favicon.png");
                return safeReply(interaction, { embeds: [embed], files: [file] });
            }

            await safeReply(interaction, embed);
        }

    }
} as ICommand;