/**
 * Avatar Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

const Save = ({ attributes }) => {
	const {
		avatarType,
		letters,
		bgColor,
		textColor,
		size,
		imageUrl,
		imageAlt,
		showName,
		name,
		position,
		nameLink,
		userId,
		blockAlign,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// Block classes
	const blockClasses = [
		'cwgb-avatar-block',
		blockAlign ? `text-${blockAlign}` : '',
		blockClass,
	].filter(Boolean).join(' ');

	// Parse data attributes
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	// Helper function to get initials from name
	const getInitials = (fullName) => {
		if (!fullName) return 'AB';
		const words = fullName.trim().split(' ').filter(w => w.length > 0);
		if (words.length === 0) return 'AB';
		if (words.length === 1) {
			return words[0].substring(0, 2).toUpperCase();
		}
		return (words[0][0] + words[words.length - 1][0]).toUpperCase();
	};

	// Avatar classes
	const getAvatarClasses = () => {
		const classes = ['avatar'];
		
		// Background and text color for letters fallback
		if (bgColor) {
			classes.push(`bg-${bgColor}`);
		}
		if (textColor) {
			classes.push(`text-${textColor}`);
		}
		
		// Size
		if (size) {
			classes.push(`w-${size}`, `h-${size}`);
		}
		
		return classes.join(' ');
	};

	return (
		<div
			className={blockClasses}
			id={blockId || undefined}
			{...dataAttributes}
		>
			{avatarType === 'user' ? (
				// User mode will be rendered via render.php
				<div className="author-info d-md-flex align-items-center">
					<div className="d-flex align-items-center">
						<figure className="user-avatar">
							<span className={getAvatarClasses()}>
								<span>U</span>
							</span>
						</figure>
						<div>
							<h6><a href="#" className="link-dark">User</a></h6>
							<span className="post-meta fs-15">Position</span>
						</div>
					</div>
				</div>
			) : (
				<div className={showName ? 'd-flex align-items-center' : ''}>
					{/* Avatar */}
					{imageUrl ? (
						<img
							className={getAvatarClasses()}
							src={imageUrl}
							alt={imageAlt || ''}
							style={showName ? { marginRight: '12px' } : {}}
						/>
					) : (
						<span className={getAvatarClasses()} style={showName ? { marginRight: '12px' } : {}}>
							<span>{getInitials(name)}</span>
						</span>
					)}

					{/* Additional Data (Name & Position) */}
					{showName && (
						<div>
							{nameLink ? (
								<div className="h6 mb-0">
									<a href={nameLink} className="link-dark">
										{name || ''}
									</a>
								</div>
							) : (
								name && (
									<div className="h6 mb-0">
										{name}
									</div>
								)
							)}
							{position && (
								<span className="post-meta fs-15 d-block">
									{position}
								</span>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Save;
