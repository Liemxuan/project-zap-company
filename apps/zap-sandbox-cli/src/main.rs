use std::env;
use std::process::{Command, exit};

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    if args.is_empty() {
        eprintln!("Usage: zap-sandbox-cli <command> [args...]");
        exit(1);
    }

    let cwd = env::current_dir().unwrap_or_else(|_| env::temp_dir());
    let sandbox_home = cwd.join(".sandbox-home");
    let sandbox_tmp = cwd.join(".sandbox-tmp");

    // Ensure our mock sandbox directories exist (to prevent errors from `unshare` or the program)
    let _ = std::fs::create_dir_all(&sandbox_home);
    let _ = std::fs::create_dir_all(&sandbox_tmp);

    let is_linux = cfg!(target_os = "linux");

    let status = if is_linux {
        let mut cmd = Command::new("unshare");
        cmd.args(["--user", "--map-root-user", "--mount", "--ipc", "--pid", "--uts", "--fork", "--net"]);
        // Then pass the target program and its args
        cmd.args(&args);
        
        // Prevent sandbox escape by changing paths inside the container view
        cmd.env("HOME", sandbox_home.display().to_string());
        cmd.env("TMPDIR", sandbox_tmp.display().to_string());
        // Propagate PATH so binaries are found
        if let Ok(path) = env::var("PATH") {
            cmd.env("PATH", path);
        }

        cmd.status()
    } else {
        // macOS / Windows fallback - unshielded bypass
        // Since `unshare` is a Linux feature, local dev on Mac runs without namespaces.
        let mut cmd = Command::new(&args[0]);
        cmd.args(&args[1..]);

        cmd.status()
    };

    match status {
        Ok(s) => exit(s.code().unwrap_or(1)),
        Err(e) => {
            eprintln!("zap-sandbox-cli execution failed: {}", e);
            exit(127);
        }
    }
}
