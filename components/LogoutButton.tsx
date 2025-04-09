// components/LogoutButton
const LogoutButton: React.FC = () => {
	return (
		<a href="/auth/logout" className="no-underline">
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md">
				Log out
			</button>
		</a>
	);
};

export default LogoutButton;