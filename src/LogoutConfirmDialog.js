export default function LogoutConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7, 18, 40, 0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 30,
        padding: "24px",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #E1E8F0",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
          padding: "28px 28px 24px",
          color: "#0E1B2A",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.3px",
            color: "#102543",
          }}
        >
          Ready to log out?
        </h3>
        <p
          style={{
            margin: "12px 0 20px",
            color: "#5C6B81",
            lineHeight: 1.6,
            fontSize: "0.98rem",
          }}
        >
          You’ll be returned to the sign in page and will need to log in again to
          continue exploring ColumbiaStream.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: "0 0 auto",
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid #E2E9F2",
              background: "#F7FAFD",
              color: "#334155",
              fontWeight: 600,
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: "0 0 auto",
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #009EFF, #0079BF)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: 140,
              boxShadow: "0 12px 26px rgba(0, 126, 233, 0.25)",
            }}
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}
