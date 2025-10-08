const resePassTemp = (username, resetLink) => {
    return `
      <div>
         <h1>Hello ${username}</h1>
         <p>this is your reset link <a href="${resetLink}"></a></p>
      </div>
    `
}

module.exports = resePassTemp;