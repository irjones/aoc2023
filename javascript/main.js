const args = process.argv.slice(2);
if (args.includes("--all")) {
    console.log("No thanks.");
} else {
    require(`./days/day${args[0]}`).run();
}
